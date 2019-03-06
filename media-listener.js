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
