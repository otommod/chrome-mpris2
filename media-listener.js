const page = new Page(chrome.runtime.connect());

const checkForMedia = () => {
    console.log('checking for media', document.querySelectorAll('video,audio'));
    document.querySelectorAll('video,audio')
      .forEach(player => page.registerPlayer(player));
};

window.addEventListener('load', () => {

    checkForMedia();

    setTimeout(() => {
        checkForMedia();
    }, 1000);

    page.observeForMedia(document.documentElement);

    window.dispatchEvent(new Event('mpris2-setup'));
});

window.addEventListener('DOMContentLoaded', checkForMedia);

function executeScript(script) {
    let element = document.createElement('script');
    element.innerHTML = '('+ script +')();';
    (document.body || document.head || document.documentElement).appendChild(element);
    // We need to remove the script tag after inserting or else websites relying on the order of items in
    // document.getElementsByTagName("script") will break (looking at you, Google Hangouts)
    element.parentNode.removeChild(element);
}

function hackAudioTags () {
    // Bug 379087: Only inject this stuff if we're a proper HTML page
    // otherwise we might end up messing up XML stuff
    // only if our documentElement is a "html" tag we'll do it
    // the rest is only set up in DOMContentLoaded which is only executed for proper pages anyway

    // tagName always returned "HTML" for me but I wouldn't trust it always being uppercase
    if (document.documentElement.tagName.toLowerCase() === 'html') {
        // here we replace the document.createElement function with our own so we can detect
        // when an <audio> tag is created that is not added to the DOM which most pages do
        // while a <video> tag typically ends up being displayed to the user, audio is not.
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
    }
}

hackAudioTags();
