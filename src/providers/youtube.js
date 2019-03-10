/**
 *
 * This file adds support for Youtube specific playback
 *
 * by extending and overriding the classes {@link Page},
 * {@link Playback}, and {@link Player}.
 * we can define how we'll interact with youtube's site
 *
 *
 */


/**
 * The metadata sent to the mpris host is defined
 * by the {@link Player} implementation
 *
 * For youtube we get:
 *  - the song title from the html
 *  - the artist from the uploader
 *  - the cover image from the static resource of the thumbnail
 */
class YouTubePlayer extends Player {

    /**
     * A youtube video can have 4 different baseURLs
     *
     * 1. /watch?v=ID_OF_VIDEO - when watching the default way
     * 2. /embed/ID_OF_VIDEO - when it is embedded on a different site
     * 3. /user/nprmusic - when in a users page
     * 4. /channel/UCC6mthPyZTpbk-Klz9RMxMw - when in a channels page
     *
     * In cases 3 and 4 we don't have a way to figure out it's video id
     * so the player id will be the full URL
     *
     * @returns {string}
     */
    getId () {
        if (this.URL.pathname === '/watch') {
            return this.URL.searchParams.get('v');
        } else if (this.URL.pathname.match('/embed')) {
            return this.URL.pathname.split('/').pop();
        } else
            return this.getUrl();
    }

    getTitle () {
        let title = document.querySelector('.ytp-title-text');
        return (title && title.textContent) || super.getTitle();
    }

    getArtists () {
        let owner = document.querySelector('#owner-name a');
        return owner && [owner.textContent];
    }

    /**
     * If we couldn't figure out the video id (see {@link getId})
     * then the player's id will be the element's baseURI, if that's the case
     * we won't be able to get the thumbnail. so call super
     *
     * @returns {string}
     */
    getCover () {
        if (this.getId().includes('/'))
            return super.getCover();
        return `https://i.ytimg.com/vi/${this.getId()}/hqdefault.jpg`;
    }
}

Player = YouTubePlayer;

/*
    PLAYBACK
 */

class YouTubePlayback extends Playback {

    setRate (rate) {
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
    }

    setVolume (volume) {
        super.setVolume(volume);
        if (volume === 0 && this.controls.volumeButton && this.controls.volumeButton.title.includes('Mute'))
            this.controls.volumeButton.click();
        else {
            if (this.controls.volumeButton && this.controls.volumeButton.title.includes('Unmute'))
                this.controls.volumeButton.click();

            if (this.controls.volumeHandle) {
                this.controls.volumeHandle.style.left = `${40 * volume}px`;
            }
        }

    };

    isShuffle () {
        return this.isControlAvailable(this.controls.shuffleButton) &&
          this.isActionPressed(this.controls.shuffleButton);
    }

    setShuffle (isShuffle) {
        if (this.controls.shuffleButton)
            this.controls.shuffleButton.click();
    }

    getLoopStatus () {
        if (this.isControlAvailable(this.controls.loopPlaylistButton) &&
          this.isActionPressed(this.controls.loopPlaylistButton))
            return LoopStatus.PLAYLIST;
        else
            return super.getLoopStatus();
    }

    setLoopStatus (status) {
        if (this.isControlAvailable(this.controls.loopPlaylistButton)) {
            if (status === LoopStatus.PLAYLIST) {
                if (!this.isActionPressed(this.controls.loopPlaylistButton))
                    this.controls.loopPlaylistButton.click();
            } else {
                if (this.isActionPressed(this.controls.loopPlaylistButton))
                    this.controls.loopPlaylistButton.click();
                super.setLoopStatus(status);
            }
        } else
            super.setLoopStatus(status);
    }

    canGoNext () {
        return !this.isButtonDisabled(this.controls.nextButton);
    }

    canGoPrevious () {
        return !this.isButtonDisabled(this.controls.previousButton);
    }

    next () {
        if (!this.isButtonDisabled(this.controls.nextButton))
            this.controls.nextButton.click();
    }

    previous () {
        if (!this.isButtonDisabled(this.controls.previousButton))
            this.controls.previousButton.click();
    }

    /**
     *
     * @param {HTMLElement} button
     * @returns {boolean}
     */
    isActionPressed (button) {
        return button.firstElementChild.getAttribute('aria-pressed') === 'true';
    }

    /**
     *
     * @param {HTMLElement} button
     * @returns {*|string}
     */
    isButtonDisabled (button) {
        return !button || button.getAttribute('aria-disabled') === 'true';
    }

    /**
     *
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    isControlAvailable (element) {
        return !!(element && element.offsetParent);
    }
}

Playback = YouTubePlayback;


class YouTubePage extends Page {

    registerPlayer (element) {
        if (this.players.find(player => player.element === element)) {
            return;
        }

        let player = new Player(this, this.host, element);

        this.players.push(player);

        let container = element.parentElement.parentElement;

        this.playback.controls = {
            ...this.playback.controls,
            nextButton: (container || document).querySelector('.ytp-next-button'),
            previousButton: (container || document).querySelector('.ytp-prev-button'),
            volumeButton: (container || document).querySelector('.ytp-mute-button.ytp-button'),
            volumeHandle: (container || document).querySelector('.ytp-volume-slider-handle')
        };

        // Ignore short sounds, they are most likely a chat notification sound
        // but still allow when undetermined (e.g. video stream)
        if (player.isPlaying() && !(isNaN(element.duration) || (element.duration > 0 && element.duration < 5))) {
            this.setActivePlayer(player);
        }
    }

}

Page = YouTubePage;

/*
    for youtube we need to listen for yt-page-data-updated
    we subscribe to mpris2-setup to make sure page is defined
 */
window.addEventListener('mpris2-setup', () => {
    window.addEventListener('yt-page-data-updated', function () {
        let playlistActionsButtons = document.querySelectorAll('#playlist-actions a');

        playlistActionsButtons.forEach(each => {
            page.observeForChanges(each.firstElementChild, {
                attributeFilter: ['aria-pressed']
            });
        });

        page.playback.controls = {
            ...page.playback.controls,
            shuffleButton: playlistActionsButtons[1],
            loopPlaylistButton: playlistActionsButtons[0]
        };

        document.querySelectorAll('video,audio')
          .forEach(player => page.registerPlayer(player));

        if (page.getActivePlayer()) {
            if (page.getActivePlayer().isHidden() && !page.getActivePlayer().isPlaying())
                page.host.quit(page.getActivePlayer());
            else
                page.host.start(page.getActivePlayer());
        }
    });
});
