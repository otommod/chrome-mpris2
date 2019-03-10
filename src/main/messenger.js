/**
 * A class in charge of building the payload expected by the native app
 * the payload must be a {@link Payload}
 */
class Messenger {
    /**
     * Generate a new {@link Messenger}
     */
    constructor () {
        /**
         *
         * @type {Payload}
         */
        this.last = {};
    }

    /**
     *
     * @param {Payload} payload
     */
    store (payload) {
        this.last = payload;
    }

    /**
     *
     * @param {Playback} playback
     * @returns {Payload}
     */
    payloadFrom (playback) {
        return {
            PlaybackStatus: playback.getStatus(),
            LoopStatus: playback.getLoopStatus(),
            Shuffle: playback.isShuffle(),
            Volume: playback.getVolume(),
            CanGoNext: playback.canGoNext(),
            CanGoPrevious: playback.canGoPrevious(),
            Identity: playback.getIdentity(),
            Rate: playback.getRate(),
            Metadata: {
                'mpris:trackid': playback.activePlayer.getId(),
                'mpris:length': playback.activePlayer.getLength(),
                'mpris:artUrl': playback.activePlayer.getCover(),
                'xesam:url': playback.activePlayer.getUrl(),
                'xesam:title': playback.activePlayer.getTitle(),
                'xesam:artist': playback.activePlayer.getArtists(),
            }
        };
    }

    /**
     *
     * @param {Payload} payload
     * @return {Payload}
     */
    onlyUpdated (payload) {
        return payload;
    }

    /**
     *
     * @param {Playback} playback
     * @returns {Payload}
     */
    requestPayload (playback) {
        let payload = this.payloadFrom(playback);
        let diffs = this.onlyUpdated(payload);
        this.store(payload);
        return diffs;
    }
}
