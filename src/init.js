hackAudioTags();

// If this project grows we should consider dependency injection
/**
 * The instance of {@link Playback} for this web site.
 * We define it here so it can be accessed by any provider specific code.
 * @const {Playback}
 */
const playback = new Playback();

/**
 * The instance of {@link Carrier} for this web site.
 * There should be no need to interact directly with it.
 * @const {Carrier}
 */
const carrier = new Carrier();

/**
 * The instance of {@link Host} for this web site.
 * There should be no need to interact directly with it.
 * @const {Host}
 */
const host = new Host(playback, carrier, chrome.runtime.connect());

/**
 * The instance of {@link Page} for this web site.
 * We define it here so it can be accessed by any provider specific code.
 * @const {Page}
 */
const page = new Page(document, playback, host);

window.addEventListener('load', () => {

    page.checkForMediaElements();

    page.observeForMedia(document.documentElement);

    setTimeout(() => {
        page.checkForMediaElements();
    }, 1000);

    window.dispatchEvent(new Event('mpris2-setup'));
});

window.addEventListener('DOMContentLoaded', () => {
    page.checkForMediaElements();
});

/**
 * Here we replace the <b>document.createElement</b> function with our own so we can detect
 * when an &lt;audio&gt; tag is created that is not added to the DOM which most pages do
 * while a &lt;video&gt; tag typically ends up being displayed to the user, audio is not.
 *
 * Original code from {@link https://github.com/KDE/plasma-browser-integration/blob/master/extension/content-script.js}
 * @ignore
 */
function hackAudioTags () {
    // Bug 379087: Only inject this stuff if we're a proper HTML page
    // otherwise we might end up messing up XML stuff
    // only if our documentElement is a "html" tag we'll do it
    // the rest is only set up in DOMContentLoaded which is only executed for proper pages anyway

    // tagName always returned "HTML" for me but I wouldn't trust it always being uppercase
    if (document.documentElement.tagName.toLowerCase() === 'html') {
        // HACK We cannot really pass variables from the page's scope to our content-script's scope
        // so we just blatantly insert the <audio> tag in the DOM and pick it up through our regular
        // mechanism. Let's see how this goes :D

        executeScript(`function() {
                var oldCreateElement = document.createElement;
                document.createElement = function () {
                    var createdTag = oldCreateElement.apply(this, arguments);
                    var tagName = arguments[0];
                    if (typeof tagName === "string" && tagName.toLowerCase() === "audio") {
                        (document.head || document.documentElement).appendChild(createdTag);
                    }
                    return createdTag;
                };
            }
        `);

        // We also briefly add items created as new Audio() to the DOM so we can control it
        // similar to the document.createElement hack above
        executeScript(`function() {
                var oldAudio = window.Audio;
                window.Audio = function () {
                    var createdAudio = new (Function.prototype.bind.apply(oldAudio, arguments));
                    (document.head || document.documentElement).appendChild(createdAudio);
                    createdAudio.parentNode.removeChild(createdAudio);
                    return createdAudio;
                };
            }
        `);
    }
}

/**
 * Execute a script on the current context and then remove it
 *
 * @ignore
 * @param {string} script
 */
function executeScript (script) {
    let element = document.createElement('script');
    element.innerHTML = '(' + script + ')();';
    (document.body || document.head || document.documentElement).appendChild(element);
    // We need to remove the script tag after inserting or else websites relying on the order of items in
    // document.getElementsByTagName("script") will break (looking at you, Google Hangouts)
    element.parentNode.removeChild(element);
}
