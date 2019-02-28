
window.addEventListener('load', evt => {
    document.querySelectorAll('video,audio')
      .forEach(player => page.registerPlayer(player));

    page.observeForMedia(document.documentElement);
});

window.addEventListener('yt-page-data-updated', e => {
    document.querySelectorAll('video,audio')
      .forEach(player => page.registerPlayer(player));
});

const page = new Page('youtube');

