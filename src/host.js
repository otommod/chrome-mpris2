class Host {
    /**
     *
     * @param {Page} page
     */
    constructor (page) {
        this.page = page;
        this.port = chrome.runtime.connect();

        /**
         * @typedef MessageTypes
         * @enum {string}
         */
        this.types = {
            CHANGE: 'changed',
            RETURN: 'return',
            SEEK: 'seeked',
            QUIT: 'quit'
        };

        this.port.onMessage.addListener((r, s, sr) => this.messageListener(r, s, sr));
    }

    /**
     * Send a message to host app
     *
     * @param {MessageTypes} type
     * @param {Object} payload
     */
    sendMessage (type, payload) {
        this.port.postMessage({
            source: this.page.source,
            type: type,
            args: [payload]
        });
    }

    /**
     * Send a change message to host app
     *
     * @param {Player} player
     */
    change (player) {
        this.sendMessage(
          this.types.CHANGE,
          {
              PlaybackStatus: player.isPlaying() ? 'Playing' : 'Paused',
              LoopStatus: player.playlist.getLoopStatus(),
              Shuffle: player.playlist.isShuffle(),
              Volume: player.getVolume(),
              CanGoNext: player.playlist.canGoNext(),
              CanGoPrevious: player.playlist.canGoPrevious(),
              Rate: player.getRate()
          }
        );
    }

    /**
     *
     * @param {Player} player
     */
    start (player) {
        this.sendMessage(
          this.types.CHANGE,
          {
              PlaybackStatus: player.isPlaying() ? 'Playing' : 'Paused',
              LoopStatus: player.playlist.getLoopStatus(),
              Shuffle: player.playlist.isShuffle(),
              Volume: player.getVolume(),
              CanGoNext: player.playlist.canGoNext(),
              CanGoPrevious: player.playlist.canGoPrevious(),
              Rate: player.getRate(),
              Metadata: {
                  'mpris:trackid': player.getId(),
                  'mpris:length': player.getLength(),
                  'mpris:artUrl': player.getCover(),
                  'xesam:title': player.getTitle(),
                  'xesam:artist': player.getArtists(),
              }
          }
        );
    }

    /**
     *
     * @param {string} method
     * @param {Object} args
     */
    return (method, args) {
        this.port.postMessage({
            source: this.page.source,
            type: this.types.RETURN,
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
          this.types.SEEK,
          player.getPosition()
        );
    }

    /**
     * Send a quit message to host
     *
     * @param {Player} player
     */
    quit (player) {
        this.sendMessage(
          this.types.QUIT,
          player
        );
    }

    /**
     *
     * @param {Object} request
     * @param {string} request.method
     * @param {Array}  request.args
     */
    messageListener (request) {
        let result;
        if (request.method === 'Get') {
            result = this.get(...request.args);
        } else if (request.method === 'Set') {
            result = this.set(...request.args);
        } else {
            //FIXME: i really like the simplicity but it's not really understandable
            result = this.page.playlist[request.method.toLowerCase()](...request.args);
        }
        if (result) {
            this.return(request.method, result);
        }
    }

    get (_, propName) {
        switch (propName) {
            case 'Position':
                return this.page.playlist.getPosition();
        }
    }

    set (_, propName, newValue) {
        switch (propName) {
            case "Rate":
                this.page.playlist.setRate(newValue);
                break;

            case "Volume":
                this.page.playlist.setVolume(newValue);
                break;

            case "Shuffle":
                this.page.playlist.setShuffle(newValue);
                break;

            case "LoopStatus":
                this.page.playlist.setLoopStatus(newValue);
                break;

            case "Fullscreen":
                this.page.playlist.toggleFullScreen();
                break;
        }
    }
}
