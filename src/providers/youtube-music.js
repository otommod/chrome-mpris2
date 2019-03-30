/**
 *
 * This file adds support for Youtube Music specific playback
 *
 * by extending and overriding the classes {@link Page},
 * {@link Playback}, and {@link Player}.
 * we can define how we'll interact with youtube's site
 *
 *
 */

/**
 * The metadata sent to the mpris host is defined
 * by the {@link Player} implementation.
 */
class YouTubeMusicPlayer extends Player {

    /**
     *
     * @returns {string}
     */
    getId () {
        let url = new URL(location);
        return url.searchParams.get('v');
    }

    /**
     * @return {string}
     */
    getTitle () {
        let title = document.querySelector('.title.ytmusic-player-bar');
        return (title && title.textContent) || super.getTitle();
    }

    /**
     * @return {Array<string>}
     */
    getArtists () {
        let artists = document.querySelector('.byline.ytmusic-player-bar');
        return (artists && artists.textContent.split(' • ').slice(0, 1)) || super.getArtists();
    }

    /**
     * @returns {string}
     */
    getCover () {
        let img = document.querySelector('#thumbnail img.yt-img-shadow');
        return (img && img.getAttribute('src')) || super.getCover();
    }
}

Player = YouTubeMusicPlayer;

/**
 * YouTube Music Playback
 */
class YouTubeMusicPlayback extends Playback {

    setRate (rate) {
        // stub (rate should not be supported)
    }

    /**
     * YouTube Music shuffles the playlist on click
     *
     * @param isShuffle
     */
    setShuffle (isShuffle) {
        if (this.controls.shuffleButton)
            this.controls.shuffleButton.click();
    }

    setVolume (volume) {
        super.setVolume(volume);
        if (volume > 0 && this.activePlayer.isMuted() && this.isActionPressed(this.controls.volumeButton)) {
            this.controls.volumeButton.click();
        }
        if (this.controls.volumeKnob) {
            this.controls.volumeKnob.style.left = `${volume * 100}%`;
            this.controls.volumeProcess.style.transform = `scaleX(${volume})`;
        }
    }

    getLoopStatus () {
        if (this.controls.loopPlaylistButton) {
            let label = this.controls.loopPlaylistButton.getAttribute('aria-label');
            return label === 'Repeat all' ? LoopStatus.PLAYLIST :
              label === 'Repeat one' ? LoopStatus.TRACK : LoopStatus.NONE;
        } else
            return super.getLoopStatus();
    }

    setLoopStatus (status) {
        this.controls.loopPlaylistButton && this.controls.loopPlaylistButton.click();
    }

    canGoNext () {
        return !!this.controls.nextButton;
    }

    canGoPrevious () {
        return !!this.controls.previousButton;
    }

    next () {
        this.controls.nextButton.click();
    }

    previous () {
        this.controls.previousButton.click();
    }

    /**
     *
     * @param {HTMLElement} button
     * @returns {boolean}
     */
    isActionPressed (button) {
        return button.getAttribute('aria-pressed') === 'true';
    }
}

Playback = YouTubeMusicPlayback;

/*
    for youtube we need to listen for yt-page-data-updated
    we subscribe to mpris2-setup to make sure page is defined
 */
window.addEventListener('mpris2-setup', () => {
    page.playback.controls = {
        nextButton: document.querySelector('.next-button.ytmusic-player-bar'),
        previousButton: document.querySelector('.previous-button.ytmusic-player-bar'),
        shuffleButton: document.querySelector('.shuffle.ytmusic-player-bar'),
        loopPlaylistButton: document.querySelector('.repeat.ytmusic-player-bar'),
        volumeKnob: document.getElementById('sliderKnob'),
        volumeProcess: document.getElementById('primaryProgress'),
        volumeButton: document.querySelector('.volume.ytmusic-player-bar')
    };

    page.observeForChanges(page.playback.controls.loopPlaylistButton, {
        attributeFilter: ['aria-label']
    });
});
