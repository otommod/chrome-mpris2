/*
    METADATA
 */

Player.prototype.getId = function () {
    return this.URL.searchParams.get('v');
};

Player.prototype.getTitle = function () {
    let title = document.querySelector('h1.title');
    return title && title.textContent;
};

Player.prototype.getArtists = function () {
    let owner = document.querySelector('#owner-name a');
    return owner && [owner.textContent];
};

Player.prototype.getCover = function () {
    return `https://i.ytimg.com/vi/${this.getId()}/hqdefault.jpg`;
};

/*
    PLABACK
 */
Playback.prototype.setRate = function (rate) {
    if (rate <= 0)
        return;
    const closestRate = rate <= 1.75 ? Math.ceil(rate * 4) : 7;

    // first make the settings menu appear
    document.querySelector('.ytp-settings-button').click();
    // then the "speed" submenu
    document.querySelectorAll('.ytp-settings-menu .ytp-menuitem')
      .forEach(each => {
          if (each.firstElementChild.innerText === 'Speed')
              each.click();
      });

    // set a timeout because of animation delays
    setTimeout(() => {
        // select the closest speed
        document.querySelectorAll('.ytp-settings-menu .ytp-menuitem')
          [closestRate - 1].click();
        // and close the settings menu again
        document.querySelector('.ytp-settings-button').click();
    }, 300);
};

// Playback.prototype.setVolume = function (volume) {
//     if ((volume === 0 && this.activePlayer.muted))
//         document.querySelector('.ytp-mute-button').click();
// };

Playback.prototype.isShuffle = function () {
    return this.shuffleElm && this.shuffleElm.offsetParent && this.shuffleElm.firstElementChild
      .getAttribute('aria-pressed') === 'true';
};

Playback.prototype.setShuffle = function () {
    this.shuffleElm.click();
    this.page.host.change();
};

/*
    for youtube we need to listen for yt-page-data-updated
    we subscribe to mpris2-setup to make sure page is defined
 */
window.addEventListener('mpris2-setup', () => {

    window.addEventListener('yt-page-data-updated', function () {

        page.playback.shuffleElm = document.querySelectorAll('#playlist-actions a')[1];

        document.querySelectorAll('video,audio')
          .forEach(player => page.registerPlayer(player));

        if (page.getActivePlayer()) {
            if (page.getActivePlayer().isHidden())
                page.host.quit(page.getActivePlayer());
            else
                page.host.start(page.getActivePlayer());
        }
    });
});
