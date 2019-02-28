const LoopStatus = {
    NONE: 'None',
    TRACK: 'Track',
    PLAYLIST: 'Playlist'
};

class PlayList {
    constructor (page) {
        this.page = page;
        /**
         * Indicates if playback should shuffle between tracks
         * @type {boolean}
         */
        this.shuffle = false;

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

    setVolume (volume) {
        if (this.activePlayer)
            this.activePlayer.setVolume(volume);
    }

    setRate (rate) {
        if (this.activePlayer)
            this.activePlayer.setRate(rate);
    }

    setShuffle (isShuffle) {
        this.shuffle = isShuffle;
    }

    isShuffle () {
        return this.shuffle;
    }

    setLoopStatus (status) {
        this.loopStatus = status;
    }

    getLoopStatus () {
        return this.loopStatus;
    }

    canGoNext () {
        return false;
    }

    canGoPrevious () {
        return false;
    }

    next () {
        console.log('Commands.Next');
    }

    previous () {
        console.log('Commands.Previous');
    }

    play () {
        if (this.activePlayer)
            this.activePlayer.play();
    }

    pause () {
        if (this.activePlayer)
            this.activePlayer.pause();
    }

    playpause () {
        if (this.activePlayer)
            this.activePlayer.playpause();
    }

    stop () {
        if (this.activePlayer)
            this.activePlayer.stop();
    }

    seek (offset) {
        if (this.activePlayer)
            this.activePlayer.seek(offset);
    }

    setposition (id, position) {
        if (this.activePlayer)
            this.activePlayer.setPosition(position);
    }

    getPosition () {
        return this.activePlayer && this.activePlayer.getPosition();
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
        if (this.activePlayer)
            this.activePlayer.toggleFullScreen();
    }

}
