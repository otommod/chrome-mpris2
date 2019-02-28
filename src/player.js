/**
 * A player that wraps around HTMLMediaElement
 *
 * It sends to the Host relevant media events (ie: play, pause, etc)
 * And receives from the host all input events and handles them
 *
 */
class Player {
    /**
     *
     * @param {PlayList} playlist
     * @param {Host} host
     * @param {HTMLMediaElement} element
     */
    constructor (playlist, host, element) {
        this.playlist = playlist;
        this.host = host;
        this.element = element;

        /**
         * A URL with the media baseURI
         * It's updated in {@link refresh} whenever metadata changes
         * @type {URL}
         */
        this.URL = new URL(element.baseURI);

        this.initMediaListeners();
    }

    /**
     * Add listeners on this.element so we propagate all necessary
     * events to the this.host
     */
    initMediaListeners () {
        this.element.addEventListener('play', () => this.playlist.setActivePlayer(this));
        this.element.addEventListener('pause', () => this.host.change(this));
        this.element.addEventListener('playing', () => this.host.change(this));
        this.element.addEventListener('ratechange', () => this.host.change(this));
        this.element.addEventListener('seeked', () => this.host.seeked(this));
        this.element.addEventListener('volumechange', () => this.host.change(this));
        this.element.addEventListener('loadedmetadata', e => this.refresh(e));
    }

    refresh () {
        this.URL = new URL(this.element.baseURI);
        this.host.start(this);
    }

    getId () {
        return this.element.baseURI;
    }

    isPlaying () {
        return !this.element.paused;
    }

    getLength () {
        return Math.trunc(this.element.duration * 1e6);
    }

    setVolume (volume) {
        this.element.volume = volume;
    }

    getVolume () {
        return this.element.muted ? 0.0 : this.element.volume;
    }

    /**
     *
     * @param {number} rate
     */
    setRate (rate) {
        this.element.playbackRate = rate;
    }

    getRate () {
        return this.element.playbackRate;
    }

    getTitle () {
        return this.URL.pathname;
    }

    getArtists () {
        return [this.URL.host];
    }

    getCover () {
        return '';
    }

    /**
     *
     * @returns {number} media current time
     */
    getPosition () {
        return Math.trunc(this.element.currentTime * 1e6);
    }


    play () {
        this.element.play()
          .then(() => {
              console.log('playing');
          })
          .catch((e) => {
              console.error(e);
          });
    }

    pause () {
        this.element.pause();
    }

    playpause () {
        if (this.isPlaying())
            this.pause();
        else
            this.play();
    }

    stop () {
        this.pause();
        this.element.currentTime = 0;
    }

    seek (offset) {
        this.element.currentTime += offset / 1e6;
    }

    setPosition (position) {
        this.element.currentTime = position / 1e6;
    }

    toggleFullScreen () {
        if (this.element.mozRequestFullScreen) {
            this.element.mozRequestFullScreen();
        } else if (this.element.webkitRequestFullScreen) {
            this.element.webkitRequestFullScreen();
        }
    }
}
