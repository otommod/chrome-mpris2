/**
 * A class in charge of building the payload expected by the native app
 * the payload must be a {@link Payload}
 */
class Carrier {
    /**
     * Generate a new {@link Carrier}
     */
    constructor () {
        /**
         *
         * @type {Payload}
         */
        this.last = {};
    }

    /**
     * Clear the last payload sent
     */
    clear () {
        this.last = {};
    }

    /**
     * Store the last payload sent
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
        let diffs = {
            Metadata: {}
        };
        for (let prop in payload) {
            if (prop === 'Metadata') {
                let changed = false;
                for (let meta in payload.Metadata) {
                    if (JSON.stringify(payload.Metadata[meta]) !== (this.last.Metadata && JSON.stringify(this.last.Metadata[meta]))) {
                        changed = true;
                    }
                }
                if (changed)
                    diffs.Metadata = payload.Metadata;
            } else if (payload[prop] !== this.last[prop])
                diffs[prop] = payload[prop];
        }
        if (Object.keys(diffs.Metadata).length === 0)
            delete diffs.Metadata;
        // noinspection JSValidateTypes
        return diffs;
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
