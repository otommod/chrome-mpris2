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
     * @param {Playback} playback
     * @param {Host} host
     * @param {HTMLMediaElement} element
     */
    constructor (playback, host, element) {
        /**
         *
         * @type {Playback}
         */
        this.playback = playback;
        /**
         *
         * @type {Host}
         */
        this.host = host;
        /**
         *
         * @type {HTMLMediaElement}
         */
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
        this.element.addEventListener('play', () => this.playback.setActivePlayer(this));
        this.element.addEventListener('pause', () => this.host.change(this.playback));
        this.element.addEventListener('playing', () => this.host.change(this.playback));
        this.element.addEventListener('ratechange', () => this.host.change(this.playback));
        this.element.addEventListener('seeked', () => this.host.seeked(this));
        this.element.addEventListener('volumechange', () => this.host.change(this.playback));
        this.element.addEventListener('loadedmetadata', e => this.refresh(e));
    }

    refresh () {
        this.URL = new URL(this.element.baseURI);
        this.host.start(this);
    }

    /**
     *
     * @returns {string} the elements source
     */
    getId () {
        return this.element.baseURI;
    }

    /**
     *
     * @returns {boolean}
     */
    isPlaying () {
        return !this.element.paused;
    }

    /**
     * Length is expected in microseconds by host
     *
     * @returns {number}
     */
    getLength () {
        return Math.trunc(this.element.duration * 1e6);
    }

    /**
     *
     * @param {number} volume
     */
    setVolume (volume) {
        this.element.volume = volume;
    }

    /**
     * If media is muted return 0
     *
     * @returns {number}
     */
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

    /**
     *
     * @returns {number}
     */
    getRate () {
        return this.element.playbackRate;
    }

    /**
     *
     * @returns {string}
     */
    getTitle () {
        return this.URL.pathname;
    }

    /**
     *
     * @returns {string[]}
     */
    getArtists () {
        return [this.URL.host];
    }

    /**
     *
     * @returns {string}
     */
    getCover () {
        return `http://logo.clearbit.com/${this.URL.host}`;
    }

    /**
     *
     * @returns {number} media current time
     */
    getPosition () {
        return Math.trunc(this.element.currentTime * 1e6);
    }

    /**
     *
     * @returns {boolean}
     */
    isLooping () {
        return this.element.loop;
    }

    /**
     * Should media loop when it reaches the end.
     *
     * @param {boolean} loop
     */
    setLoop (loop) {
        this.element.loop = loop;
    }

    /**
     * Play media element
     */
    play () {
        this.element.play()
          .then(() => {
              console.debug('playing');
          })
          .catch((e) => {
              console.debug(e);
          });
    }

    /**
     * Pause media element
     */
    pause () {
        this.element.pause();
    }

    /**
     * If media is playing then pause
     * else play it
     */
    playpause () {
        if (this.isPlaying())
            this.pause();
        else
            this.play();
    }

    /**
     * Pause media and set position to 0
     */
    stop () {
        this.pause();
        this.setPosition(0);
    }

    /**
     * @param {number} offset - offset to currentTime in microseconds
     */
    seek (offset) {
        this.element.currentTime += offset / 1e6;
    }

    /**
     *
     * @param {number} position - new currentTime in microseconds
     */
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

    /**
     *
     * @returns {string}
     */
    getSiteDomain () {
        return this.URL.host;
    }

    /**
     *
     * @returns {string}
     */
    getUrl () {
        return this.element.baseURI;
    }

    /**
     *
     * @returns {boolean}
     */
    isHidden () {
        return this.element.offsetParent === null;
    }
}
