/**
 * There should be one instance of Playback per page
 *
 * This class is in charge of handling the playback of the active player
 * it receives the commands from its {@link Host} and communicates the accordingly
 * to the player.
 *
 * It's also the responsible for exposing all the getters necessary
 * to conform the {@link Payload} message.
 *
 * By default all properties of {@link Payload} are extracted from the {@link this.activePlayer}
 * although it is expected that this functionality is overridden by the providers.
 */
class Playback {
    /**
     * Create a new instance
     */
    constructor () {
        /**
         * A dictionary of any controls extracted from the DOM
         * @type {Object.<string, HTMLElement>}
         */
        this.controls = {};

        /**
         * The current player being shown by the MPRIS2 interface
         *
         * @type {Player}
         */
        this.activePlayer = null;
    }

    /**
     * One of {@link PlaybackStatus.PLAYING} or {@link PlaybackStatus.PAUSED}
     * @returns {string}
     */
    getStatus () {
        return this.activePlayer && this.activePlayer.isPlaying() ? PlaybackStatus.PLAYING : PlaybackStatus.PAUSED;
    }

    /**
     * Set the volume of playback
     * @param {number} volume
     */
    setVolume (volume) {
        this.activePlayer && this.activePlayer.setVolume(volume);
    }

    /**
     * Get the volume of playback
     * @returns {number}
     */
    getVolume () {
        return this.activePlayer && this.activePlayer.getVolume();
    }

    /**
     * Set the rate of playback.
     * @example
     * playback.setRate(1.5);
     * @param {number} rate
     */
    setRate (rate) {
        this.activePlayer && this.activePlayer.setRate(rate);
    }

    /**
     * Get the rate of playback
     * @returns {number}
     */
    getRate () {
        return this.activePlayer && this.activePlayer.getRate();
    }

    /**
     * Set the shuffle between tracks of playback
     * @param {boolean} isShuffle
     */
    setShuffle (isShuffle) {}

    /**
     * Get if the playback is shuffling between tracks
     * @return {boolean}
     */
    isShuffle () {
        return false;
    }

    /**
     * By default we don't support playlist looping ({@link LoopStatus}.PLAYLIST)
     * so we force {@link LoopStatus}.TRACK loop if any loop other than {@link LoopStatus}.NONE is specified
     *
     * @param {LoopStatus} status
     */
    setLoopStatus (status) {
        let loopStatus = status === LoopStatus.PLAYLIST ? LoopStatus.TRACK : status;
        this.activePlayer && this.activePlayer.setLoop(loopStatus === LoopStatus.TRACK);
    }

    /**
     * Get the loop status of playback
     * @returns {LoopStatus}
     */
    getLoopStatus () {
        return this.activePlayer && this.activePlayer.isLooping() ?
          LoopStatus.TRACK : LoopStatus.NONE;
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
     * Go to next media
     * This should be implemented per provider
     */
    next () {}

    /**
     * Go to previous
     * This should be implemented per provider
     */
    previous () {}

    /**
     * **COMMAND** Start to play active player
     */
    play () {
        this.activePlayer && this.activePlayer.play();
    }

    /**
     * **COMMAND** Pause active player
     */
    pause () {
        this.activePlayer && this.activePlayer.pause();
    }

    /**
     * **COMMAND** Toggle between play and pause
     */
    togglePlayback () {
        this.activePlayer && this.activePlayer.playPause();
    }

    /**
     * **COMMAND** Stop active player
     */
    stop () {
        this.activePlayer && this.activePlayer.stop();
    }

    /**
     * **COMMAND** Seek activePlayer to offset
     *
     * @param {number} offset
     */
    seek (offset) {
        this.activePlayer && this.activePlayer.seek(offset);
    }

    /**
     * **COMMAND** Set current position of active player
     *
     * @param {string} id - the id of the player
     * @param {number} position
     */
    setPosition (id, position) {
        this.activePlayer && this.activePlayer.setPosition(position);
    }

    /**
     * **COMMAND** Get active player's position
     *
     * @returns {number}
     */
    getPosition () {
        return this.activePlayer !== null ? this.activePlayer.getPosition() : null;
    }

    /**
     * Set the current active player
     *
     * @param {Player} player
     */
    setActivePlayer (player) {
        if (player.isValid()) {
            this.activePlayer = player;
        }
    }

    /**
     * **COMMAND** Toggle the fullscreen state
     *
     * @todo test this works
     */
    toggleFullScreen () {
        this.activePlayer && this.activePlayer.toggleFullScreen();
    }

    /**
     * Get the identity of playback, by default it is the site's domain
     *
     * @returns {string}
     */
    getIdentity () {
        return this.activePlayer && this.activePlayer.getSiteDomain();
    }

}
