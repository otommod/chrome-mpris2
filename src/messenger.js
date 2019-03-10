/**
 * @typedef {Object} Metadata
 * @property {string} 'mpris:trackid' - the track id (can be anything)
 * @property {number} 'mpris:length' - the length of the media
 * @property {string} 'mpris:artUrl' - the url of the cover image
 * @property {string} 'xesam:url' - the url of the media
 * @property {string} 'xesam:title' - the title of the media
 * @property {Array<string>} 'xesam:artist' - an array containing the artists
 */

/**
 * A payload that the native app understands
 *
 * @typedef {Object} Payload
 * @property {string} PlaybackStatus - Playing or Paused
 * @property {LoopStatus} LoopStatus - the loop status
 * @property {boolean} Shuffle - is shuffle on
 * @property {number} Volume - the volume
 * @property {boolean} CanGoNext - if the next button should be enabled
 * @property {boolean} CanGoPrevious - if previous button should be enabled
 * @property {string} Identity - the identity of the mpris player
 * @property {number} Rate - the playback speed of the media
 * @property {Metadata} Metadata - the media specific information
 */

class Messenger {
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
