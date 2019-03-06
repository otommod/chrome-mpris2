/*
    METADATA
 */

class YouTubePlayer extends Player {

    getId () {
        return this.URL.searchParams.get('v');
    }

    getTitle () {
        let title = document.querySelector('h1.title');
        return title && title.textContent;
    }

    getArtists () {
        let owner = document.querySelector('#owner-name a');
        return owner && [owner.textContent];
    }

    getCover () {
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
            nextButton: document.querySelector('.ytp-next-button'),
            previousButton: document.querySelector('.ytp-prev-button'),
            volumeButton: document.querySelector('.ytp-mute-button.ytp-button'),
            volumeHandle: document.querySelector('.ytp-volume-slider-handle'),
            shuffleButton: playlistActionsButtons[1],
            loopPlaylistButton: playlistActionsButtons[0]
        };

        document.querySelectorAll('video,audio')
          .forEach(player => page.registerPlayer(player));

        if (page.getActivePlayer()) {
            if (page.getActivePlayer().isHidden() && !page.getActivePlayer().isPlaying())

            // Sometimes (like when toggling miniplayer)
            // youtube will hide the video for a small amount of time
            // this double check is to bypass that
            // setTimeout(() => {
            //     if (page.getActivePlayer().isHidden())
                page.host.quit(page.getActivePlayer());
            // }, 500);
            else
                page.host.start(page.getActivePlayer());
        }
    });
});
