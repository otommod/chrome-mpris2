/**
 * A class that wraps around HTMLMediaElement
 *
 * It sends to the {@link Host} all relevant media events (ie: play, pause, etc)
 *
 * This class should be extended in order to give **provider** specific support.
 * By default all getter and setters interact with the media element, this can be overwritten
 * by extending this class so it gets and sets by interacting with the relevant places for each **provider**.
 */
class Player {
    /**
     * Create a new instance of player
     * @param {Page} page
     * @param {Host} host
     * @param {HTMLMediaElement} element
     */
    constructor (page, host, element) {
        /**
         * The {@link Page} that holds the player
         * @type {Page}
         */
        this.page = page;
        /**
         * The {@link Host} to communicate with
         * @type {Host}
         */
        this.host = host;
        /**
         * The media element
         * @type {HTMLMediaElement}
         */
        this.element = element;
        /**
         * A URL with the media baseURI
         * It's updated in {@link refresh} whenever metadata changes
         * @type {URL}
         */
        this.URL = new URL(element.baseURI);
        this.initDefaultMediaListeners();
    }

    /**
     * Add listeners on this.element so we propagate all necessary
     * events to the this.host
     */
    initDefaultMediaListeners () {
        this.element.addEventListener('play', () => this.refresh());
        this.element.addEventListener('durationchange', () => this.refresh());
        this.element.addEventListener('loadedmetadata', () => this.refresh());
        this.element.addEventListener('loadstart', () => this.refresh());
    }

    /**
     * Update this.URL so getter read the correct data.
     * Also trigger a {@link this.host.start} event on the {@link Host}.
     */
    refresh () {
        this.URL = new URL(this.element.baseURI);
        if (this.isValid()) {
            this.element.addEventListener('pause', () => this.host.change());
            this.element.addEventListener('playing', () => this.host.change());
            this.element.addEventListener('ratechange', () => this.host.change());
            this.element.addEventListener('seeked', () => this.host.seeked(this));
            this.element.addEventListener('volumechange', () => this.host.change());
            this.host.start(this);
        }
    }

    /**
     * Get the id of the player
     * @returns {string} the elements source
     */
    getId () {
        return this.element.baseURI;
    }

    /**
     * Is the media playing?
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
     * Set the volume of the media
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
     * Is the media muted?
     *
     * @return {boolean}
     */
    isMuted () {
        return this.element.muted;
    }

    /**
     * Set the playback rate
     * @param {number} rate
     */
    setRate (rate) {
        this.element.playbackRate = rate;
    }

    /**
     * Get the playback rate
     * @returns {number}
     */
    getRate () {
        return this.element.playbackRate;
    }

    /**
     * Get the title of the player. The page's title by default.
     *
     * @returns {string}
     */
    getTitle () {
        return this.page.getTitle();
    }

    /**
     * Get the artists of the player
     *
     * @returns {Array<string>}
     */
    getArtists () {
        return [this.URL.host];
    }

    /**
     * Get the cover of the player.
     *
     * Using logo.clearbit.com API seems to work quite nicely.
     * The other alternative is to get the logo from the page's favicon ({@link this.page.getIcon()})
     *
     * @returns {string}
     */
    getCover () {
        return `http://logo.clearbit.com/${this.URL.host}`;
    }

    /**
     * Get the current time of the media
     *
     * @returns {number} media current time
     */
    getPosition () {
        return Math.trunc(this.element.currentTime * 1e6);
    }

    /**
     * Is the media looping?
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
        return this.element.play();
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
    playPause () {
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
     * seek by an offset to position
     *
     * @param {number} offset - offset to currentTime in microseconds
     */
    seek (offset) {
        this.element.currentTime += offset / 1e6;
    }

    /**
     * Set the position of playback
     * @param {number} position - new currentTime in microseconds
     */
    setPosition (position) {
        this.element.currentTime = position / 1e6;
    }

    /**
     * Toogle the fullscreen state of the media.
     * @todo test this works
     */
    toggleFullScreen () {
        if (this.element.mozRequestFullScreen) {
            this.element.mozRequestFullScreen();
        } else if (this.element.webkitRequestFullScreen) {
            this.element.webkitRequestFullScreen();
        }
    }

    /**
     * Get the site domain (host)
     * @returns {string}
     */
    getSiteDomain () {
        return this.URL.host;
    }

    /**
     * Get the elements url
     * @returns {string}
     */
    getUrl () {
        return this.element.baseURI;
    }

    /**
     * Check if element is visible to the user
     *
     * @returns {boolean}
     */
    isHidden () {
        return this.element.offsetParent === null;
    }

    /**
     *
     * @return {boolean}
     */
    isValid () {
        return !isNaN(this.element.duration) && this.element.duration > 5;
    }
}
