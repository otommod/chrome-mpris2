/**
 *
 * A class in charge of communicating back and forth with the native app.
 *
 * There should be no need to modify/extend this class
 * as it uses {@link Playback} to build the messages to send
 * and as the receiver of all messages from the MPRIS2 interfase
 *
 */
class Host {
    /**
     *
     * @param {Playback} playback - the playback of the current site
     * @param {Carrier} carrier
     * @param {Object} port - see {@link https://developer.chrome.com/apps/runtime#type-Port}
     */
    constructor (playback, carrier, port) {
        /**
         * The playback to interact with
         * @type {Playback}
         */
        this.playback = playback;
        /**
         * A carrier for caching and building the payloads
         * @type {Carrier}
         */
        this.carrier = carrier;
        /**
         * A chrome.runtime.Port
         * @see https://developer.chrome.com/apps/runtime#type-Port
         * @type {Object}
         */
        this.port = port;

        /**
         * The default Payload.Identity for the MPRIS2 Interface
         * @type {string}
         */
        this.source = 'browser';

        this.port.onMessage.addListener((r, s, sr) => this.messageListener(r, s, sr));
    }

    /**
     * Send a message to host app
     *
     * @param {MessageType} type
     * @param {Object} [payload]
     */
    sendMessage (type, payload) {
        this.port.postMessage({
            source: this.source,
            type: type,
            args: [payload]
        });
    }

    /**
     * Send a change message to host app
     */
    change () {
        if (this.playback.activePlayer) {
            let payload = this.carrier.requestPayload(this.playback);
            if (Object.keys(payload).length)
                this.sendMessage(
                  MessageType.CHANGE,
                  payload
                );
        }
    }

    /**
     * Set player as active player and send data to native app
     *
     * @param {Player} player
     */
    start (player) {
        this.playback.setActivePlayer(player);
        this.change();
    }

    /**
     *
     * @param {MessageMethod} method
     * @param {Object} args
     */
    return (method, args) {
        this.port.postMessage({
            source: this.source,
            type: MessageType.RETURN,
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
          MessageType.SEEK,
          player.getPosition()
        );
    }

    /**
     * Send a quit message to host
     */
    quit () {
        this.carrier.clear();
        this.sendMessage(
          MessageType.QUIT
        );
    }

    /**
     * Listener for messages from native application (aka: mpris interface)
     *
     * @param {Object} request
     * @param {MessageMethod} request.method
     * @param {Array}  request.args
     */
    messageListener (request) {
        let result;
        if (request.method === MessageMethod.GET) {
            result = this.get(...request.args);
        } else if (request.method === MessageMethod.SET) {
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
     * @param {MessageProperty} propName - property that should be returned
     * @returns {number}
     */
    get (_, propName) {
        switch (propName) {
            case MessageProperty.POSITION:
                return this.playback.getPosition();
        }
    }

    /**
     * Native application wants to Set a property
     * in the client.
     *
     * @param {string} _ - org.mpris.MediaPlayer2.Player
     * @param {MessageProperty} propName - property to set
     * @param {*} newValue - depends on the property to set
     */
    set (_, propName, newValue) {
        switch (propName) {
            case MessageProperty.RATE:
                this.playback.setRate(newValue);
                break;

            case MessageProperty.VOLUME:
                this.playback.setVolume(newValue);
                break;

            case MessageProperty.SHUFFLE:
                this.playback.setShuffle(newValue);
                break;

            case MessageProperty.LOOP_STATUS:
                this.playback.setLoopStatus(newValue);
                break;

            case MessageProperty.FULL_SCREEN:
                this.playback.toggleFullScreen();
                break;
        }
    }

    /**
     * Native application wants to run a command on playback
     *
     * @param {MessageMethod} name
     */
    command (name) {
        switch (name) {
            case MessageMethod.PLAY:
                this.playback.play();
                break;
            case MessageMethod.PAUSE:
                this.playback.pause();
                break;
            case MessageMethod.TOGGLE:
                this.playback.togglePlayback();
                break;
            case MessageMethod.STOP:
                this.playback.stop();
                break;
            case MessageMethod.NEXT:
                this.playback.next();
                break;
            case MessageMethod.PREVIOUS:
                this.playback.previous();
                break;
            case MessageMethod.SEEK:
                this.playback.seek(arguments[1]);
                break;
            case MessageMethod.SET_POSITION: //why is this not in set?
                this.playback.setPosition(arguments[1], arguments[2]);
                break;
        }
    }
}
