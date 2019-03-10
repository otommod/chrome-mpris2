/**
 *
 * @type {Object}
 * @property {string} CHANGE=changed - whether a mrpis2 property has changed
 * @property {string} RETURN=return - if we are returning an expected value
 * @property {string} SEEK=seeked - seeking
 * @property {string} QUIT=quit - inform to close the player
 */
const MessageType = {
    CHANGE: 'changed',
    RETURN: 'return',
    SEEK: 'seeked',
    QUIT: 'quit'
};

/**
 *
 * @constant {Object}
 * @property {string} GET=Get - request a property from the client
 * @property {string} SET=Set - request to set a property in the client
 * @property {string} PLAY=Play - request to start playing the current media
 * @property {string} PAUSE=Pause - request to pause the current media
 * @property {string} TOGGLE=PlayPause - request to toggle playback of current media
 * @property {string} STOP=Stop - request to completely stop playback
 * @property {string} NEXT=Next - request to skip to next media
 * @property {string} PREVIOUS=Previous - request to skip to previous media
 * @property {string} SEEK=Seek - request to move current playback position by some offset
 * @property {string} SET_POSITION=SetPosition - request to move current playback position to specific point
 */
const MessageMethod = {
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
 * @constant {Object}
 * @property {string} POSITION=Position - the time of playback
 * @property {string} RATE=Rate - the speed rate of playback
 * @property {string} VOLUME=Volume - the volume of playback
 * @property {string} SHUFFLE=Shuffle - the shuffle state of playback
 * @property {string} LOOP_STATUS=LoopStatus - the loop status of playback
 * @property {string} FULL_SCREEN=Fullscreen - the fullscreen state
 */
const MessageProperty = {
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
     * @param {Playback} playback - the playback of the current site
     * @param {Messenger} messenger
     * @param {Object} port - see {@link https://developer.chrome.com/apps/runtime#type-Port}
     */
    constructor (playback, messenger, port) {
        this.playback = playback;
        this.messenger = messenger;
        this.port = port;

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
            let payload = this.messenger.requestPayload(this.playback);
            if (Object.keys(payload).length)
                this.sendMessage(
                  MessageType.CHANGE,
                  payload
                );
        }
    }

    /**
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
