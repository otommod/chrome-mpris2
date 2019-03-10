/**
 *
 * @type {{NONE: string, TRACK: string, PLAYLIST: string}}
 */
const LoopStatus = {
    NONE: 'None',
    TRACK: 'Track',
    PLAYLIST: 'Playlist'
};

class Playback {
    /**
     *
     */
    constructor () {
        /**
         *
         * @type {Object.<string, HTMLElement>}
         */
        this.controls = {};
        /**
         *
         * @type {LoopStatus}
         */
        this.loopStatus = LoopStatus.NONE;

        /**
         *
         * @type {Player}
         */
        this.activePlayer = null;
    }

    /**
     *
     * @returns {string}
     */
    getStatus () {
        return this.activePlayer && this.activePlayer.isPlaying() ? 'Playing' : 'Paused';
    }

    setVolume (volume) {
        this.activePlayer && this.activePlayer.setVolume(volume);
    }

    /**
     *
     * @returns {number}
     */
    getVolume () {
        return this.activePlayer && this.activePlayer.getVolume();
    }

    /**
     *
     * @param {number} rate
     */
    setRate (rate) {
        this.activePlayer && this.activePlayer.setRate(rate);
    }

    /**
     *
     * @returns {number}
     */
    getRate () {
        return this.activePlayer && this.activePlayer.getRate();
    }

    setShuffle (isShuffle) {}

    isShuffle () {
        return false;
    }

    /**
     * By default we don't support playlist looping
     * so we force track loop if any loop is specified
     *
     * @param {LoopStatus} status
     */
    setLoopStatus (status) {
        this.loopStatus = status === LoopStatus.PLAYLIST ? LoopStatus.TRACK : status;
        this.activePlayer && this.activePlayer.setLoop(this.loopStatus === LoopStatus.TRACK);
    }

    /**
     *
     * @returns {LoopStatus}
     */
    getLoopStatus () {
        return this.loopStatus;
    }

    /**
     * Check current page for 'next' functionality
     *
     * @returns {boolean}
     */
    canGoNext () {
        return false;
    }

    /**
     * Check current page for 'previous' functionality
     *
     * @returns {boolean}
     */
    canGoPrevious () {
        return false;
    }

    /**
     * This should be implemented per provider
     */
    next () {}

    /**
     * This should be implemented per provider
     */
    previous () {}

    /**
     * Start play active player
     */
    play () {
        this.activePlayer && this.activePlayer.play();
    }

    /**
     * Pauses active player
     */
    pause () {
        this.activePlayer && this.activePlayer.pause();
    }

    /**
     * Toggle betwen play and pause
     */
    togglePlayback () {
        this.activePlayer && this.activePlayer.playpause();
    }

    /**
     * Stop active player
     */
    stop () {
        this.activePlayer && this.activePlayer.stop();
    }

    /**
     * Seek activePlayer to offset
     *
     * @param {number} offset
     */
    seek (offset) {
        this.activePlayer && this.activePlayer.seek(offset);
    }

    /**
     * Set current position of active player
     *
     * @param {string} id - the id of the player
     * @param {number} position
     */
    setPosition (id, position) {
        this.activePlayer && this.activePlayer.setPosition(position);
    }

    /**
     * Get active player's position
     *
     * @returns {number}
     */
    getPosition () {
        return this.activePlayer !== null ? this.activePlayer.getPosition() : null;
    }

    /**
     *
     * @param {Player} player
     */
    setActivePlayer (player) {
        this.activePlayer = player;
    }

    /**
     *
     */
    toggleFullScreen () {
        this.activePlayer && this.activePlayer.toggleFullScreen();
    }

    /**
     *
     * @returns {string}
     */
    getIdentity () {
        return this.activePlayer && this.activePlayer.getSiteDomain();
    }

}
