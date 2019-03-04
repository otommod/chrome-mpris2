const LoopStatus = {
    NONE: 'None',
    TRACK: 'Track',
    PLAYLIST: 'Playlist'
};

class Playback {
    /**
     *
     * @param {Page} page
     */
    constructor (page) {
        this.page = page;
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

    getStatus () {
        return this.activePlayer.isPlaying() ? 'Playing' : 'Paused';
    }

    setVolume (volume) {
        this.activePlayer.setVolume(volume);
    }

    getVolume () {
        return this.activePlayer.getVolume();
    }

    setRate (rate) {
        this.activePlayer.setRate(rate);
    }

    getRate () {
        this.activePlayer.getRate();
    }

    setShuffle (isShuffle) {}

    isShuffle () {
        return false;
    }

    setLoopStatus (status) {}

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
     * TODO: play next media
     *
     */
    next () {}

    /**
     * TODO: play previous media
     */
    previous () {}

    /**
     * Start play active player
     */
    play () {
        this.activePlayer.play();
    }

    /**
     * Pauses active player
     */
    pause () {
        this.activePlayer.pause();
    }

    /**
     * Toggle betwen play and pause
     */
    togglePlayback () {
        this.activePlayer.playpause();
    }

    /**
     * Stop active player
     */
    stop () {
        this.activePlayer.stop();
    }

    /**
     * Seek activePlayer to offset
     *
     * @param {number} offset
     */
    seek (offset) {
        this.activePlayer.seek(offset);
    }

    /**
     * Set current position of active player
     *
     * @param {string} id - the id of the player
     * @param {number} position
     */
    setPosition (id, position) {
        this.activePlayer.setPosition(position);
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
        this.page.host.start(this.activePlayer);
    }

    toggleFullScreen () {
        this.activePlayer.toggleFullScreen();
    }

}
