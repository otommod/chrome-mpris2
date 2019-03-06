/**
 *
 * @type {{RETURN: string, QUIT: string, CHANGE: string, SEEK: string}}
 */
const HostType = {
    CHANGE: 'changed',
    RETURN: 'return',
    SEEK: 'seeked',
    QUIT: 'quit'
};

/**
 *
 * @type {{PAUSE: string, PLAY: string, SET: string, TOGGLE: string, STOP: string, SET_POSITION: string, GET: string, NEXT: string, PREVIOUS: string, SEEK: string}}
 */
const HostMethod = {
    GET: 'Get',
    SET: 'Set',
    PLAY: 'Play',
    PAUSE: 'Pause',
    TOGGLE: 'PlayPause',
    STOP: 'Stop',
    NEXT: 'Next',
    PREVIOUS: 'Previous',
    SEEK: 'Seek',
    SET_POSITION: 'SetPosition'
};

/**
 *
 * @type {{POSITION: string, LOOP_STATUS: string, FULL_SCREEN: string, RATE: string, VOLUME: string, SHUFFLE: string}}
 */
const HostProperty = {
    POSITION: 'Position',
    RATE: 'Rate',
    VOLUME: 'Volume',
    SHUFFLE: 'Shuffle',
    LOOP_STATUS: 'LoopStatus',
    FULL_SCREEN: 'Fullscreen'
};

class Host {
    /**
     *
     * @param {Playback} playback - the page playing the media
     * @param {Object} port - see {@link https://developer.chrome.com/apps/runtime#type-Port}
     */
    constructor (playback, port) {
        this.playback = playback;
        this.port = port;

        this.source = 'browser';
        this.port.onMessage.addListener((r, s, sr) => this.messageListener(r, s, sr));
    }

    /**
     * Send a message to host app
     *
     * @param {HostType} type
     * @param {Object} [payload]
     */
    sendMessage (type, payload) {
        this.port.postMessage({
            source: this.source,
            type: type,
            args: [payload]
        });
    }

    buildPayload () {
        return {
            PlaybackStatus: this.playback.getStatus(),
            LoopStatus: this.playback.getLoopStatus(),
            Shuffle: this.playback.isShuffle(),
            Volume: this.playback.getVolume(),
            CanGoNext: this.playback.canGoNext(),
            CanGoPrevious: this.playback.canGoPrevious(),
            Identity: this.playback.getIdentity(),
            Rate: this.playback.getRate()
        };
    }

    /**
     * Send a change message to host app
     */
    change () {
        if (this.playback.activePlayer) {
            this.sendMessage(
              HostType.CHANGE,
              this.buildPayload()
            );
        }
    }

    /**
     *
     * @param {Player} player
     */
    start (player) {
        let payload = this.buildPayload();
        this.sendMessage(
          HostType.CHANGE,
          {
              ...payload,
              Metadata: {
                  'mpris:trackid': player.getId(),
                  'mpris:length': player.getLength(),
                  'mpris:artUrl': player.getCover(),
                  'xesam:url': player.getUrl(),
                  'xesam:title': player.getTitle(),
                  'xesam:artist': player.getArtists(),
              }
          }
        );
    }

    /**
     *
     * @param {HostMethod} method
     * @param {Object} args
     */
    return (method, args) {
        this.port.postMessage({
            source: this.source,
            type: HostType.RETURN,
            method, args
        });
    }

    /**
     * Send a seeked message to host
     *
     * @param {Player} player
     */
    seeked (player) {
        this.sendMessage(
          HostType.SEEK,
          player.getPosition()
        );
    }

    /**
     * Send a quit message to host
     */
    quit () {
        this.sendMessage(
          HostType.QUIT
        );
    }

    /**
     * Listener for messages from native application (aka: mpris interface)
     *
     * @param {Object} request
     * @param {HostMethod} request.method
     * @param {Array}  request.args
     */
    messageListener (request) {
        let result;
        if (request.method === HostMethod.GET) {
            result = this.get(...request.args);
        } else if (request.method === HostMethod.SET) {
            result = this.set(...request.args);
        } else {
            result = this.command(request.method, ...request.args);
        }
        if (result) {
            this.return(request.method, result);
        } else {
            this.change();
        }
    }

    /**
     * Native application wants to Get a property from client
     *
     * @param {string} _ - org.mpris.MediaPlayer2.Player
     * @param {HostProperty} propName - property that should be returned
     * @returns {number}
     */
    get (_, propName) {
        switch (propName) {
            case HostProperty.POSITION:
                return this.playback.getPosition();
        }
    }

    /**
     * Native application wants to Set a property
     * in the client.
     *
     * @param {string} _ - org.mpris.MediaPlayer2.Player
     * @param {HostProperty} propName - property to set
     * @param {*} newValue - depends on the property to set
     */
    set (_, propName, newValue) {
        switch (propName) {
            case HostProperty.RATE:
                this.playback.setRate(newValue);
                break;

            case HostProperty.VOLUME:
                this.playback.setVolume(newValue);
                break;

            case HostProperty.SHUFFLE:
                this.playback.setShuffle(newValue);
                break;

            case HostProperty.LOOP_STATUS:
                this.playback.setLoopStatus(newValue);
                break;

            case HostProperty.FULL_SCREEN:
                this.playback.toggleFullScreen();
                break;
        }
    }

    /**
     * Native application wants to run a command on playback
     *
     * @param {HostMethod} name
     * @param {string} id
     * @param {number} value
     */
    command (name, id, value) {
        switch (name) {
            case HostMethod.PLAY:
                this.playback.play();
                break;
            case HostMethod.PAUSE:
                this.playback.pause();
                break;
            case HostMethod.TOGGLE:
                this.playback.togglePlayback();
                break;
            case HostMethod.STOP:
                this.playback.stop();
                break;
            case HostMethod.NEXT:
                this.playback.next();
                break;
            case HostMethod.PREVIOUS:
                this.playback.previous();
                break;
            case HostMethod.SEEK:
                this.playback.seek(value);
                break;
            case HostMethod.SET_POSITION: //why is this not in set?
                this.playback.setPosition(id, value);
                break;
        }
    }
}
