/**
 * A player that wraps around HTMLMediaElement
 *
 * It sends to the Host relevant media events (ie: play, pause, etc)
 * And receives from the host all input events and handles them
 *
 */
class Player {
    /**
     *
     * @param {Page} page
     * @param {Host} host
     * @param {HTMLMediaElement} element
     */
    constructor (page, host, element) {
        this.page = page;
        this.host = host;
        this.element = element;

        /**
         * A URL with the media baseURI
         * It's updated in {@link refresh} whenever metadata changes
         *
         * @type {URL}
         */
        this.URL = new URL(element.baseURI);

        this.initListeners();
    }

    /**
     * Add listeners on this.element so we propagate all necessary
     * events to the this.host
     */
    initListeners () {
        this.element.addEventListener('play', () => this.page.setActivePlayer(this));
        this.element.addEventListener('pause', () => this.host.change(this));
        this.element.addEventListener('playing', () => this.host.change(this));
        this.element.addEventListener('ratechange', () => this.host.change(this));
        this.element.addEventListener('seeked', () => this.host.seeked(this));
        this.element.addEventListener('volumechange', () => this.host.change(this));
        this.element.addEventListener('loadedmetadata', e => this.refresh(e));
    }

    refresh () {
        this.URL = new URL(this.element.baseURI);
        this.host.start(this);
    }

    getId () {
        return this.element.baseURI;
    }

    isPlaying () {
        return !this.element.paused;
    }

    getLoopStatus () {
        return 'None';
    }

    getLength () {
        return Math.trunc(this.element.duration * 1e6);
    }

    isShuffle () {
        return false;
    }

    getVolume () {
        return this.element.muted ? 0.0 : this.element.volume;
    }

    canGoNext () {
        return false;
    }

    canGoPrevious () {
        return false;
    }

    getRate () {
        return this.element.playbackRate;
    }

    /**
     *
     * @param {number} rate
     */
    setRate (rate) {
        this.element.playbackRate = rate;
    }

    getTitle () {
        return this.URL.pathname;
    }

    getArtists () {
        return [this.URL.host];
    }

    getCover () {
        // return `https://i.ytimg.com/vi/${this.URL.searchParams.get('v')}/hqdefault.jpg`;
        return '';
    }

    /**
     *
     * @returns {number} media current time
     */
    getPosition () {
        return Math.trunc(this.element.currentTime * 1e6);
    }

    play () {
        this.element.play()
          .then(() => {
              console.log('playing');
          })
          .catch((e) => {
              console.error(e);
          });
    }

    pause () {
        this.element.pause();
    }

    playpause () {
        if (this.isPlaying())
            this.pause();
        else
            this.play();
    }

    stop () {
        this.pause();
        this.element.currentTime = 0;
    }

    next () {
        console.log('Commands.Next');
    }

    previous () {
        console.log('Commands.Previous');
    }

    seek (offset) {
        this.element.currentTime += offset / 1e6;
    }

    setposition (id, position) {
        this.element.currentTime = position / 1e6;
    }
}

class Host {
    /**
     *
     * @param {Page} page
     * @param {Object} port
     */
    constructor (page, port) {
        this.page = page;
        this.port = port;

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
              LoopStatus: player.getLoopStatus(),
              Shuffle: player.isShuffle(),
              Volume: player.getVolume(),
              CanGoNext: player.canGoNext(),
              CanGoPrevious: player.canGoPrevious(),
              Rate: player.getRate()
          }
        );
    }

    start (player) {
        this.sendMessage(
          this.types.CHANGE,
          {
              PlaybackStatus: player.isPlaying() ? 'Playing' : 'Paused',
              LoopStatus: player.getLoopStatus(),
              Shuffle: player.isShuffle(),
              Volume: player.getVolume(),
              CanGoNext: player.canGoNext(),
              CanGoPrevious: player.canGoPrevious(),
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
     * @param {Array} request.args
     */
    messageListener (request) {
        if (this.page.activePlayer) {
            let result;
            if (request.method === 'Get') {
                result = this.get(...request.args);
            } else if (request.method === 'Set') {
                result = this.set(...request.args);
            } else {
                result = this.page.activePlayer[request.method.toLowerCase()](...request.args);
            }
            if (result) {
                this.return(request.method, result);
            }
        }
    }

    get (_, propName) {
        switch (propName) {
            case 'Position':
                return this.page.activePlayer.getPosition();
        }
    }

    set (_, propName, newValue) {
        switch (propName) {
            case 'Rate':
                this.page.activePlayer.setRate(newValue);
                break;
            case 'Volume':
                break;
            case 'Shuffle':
                break;
            case 'LoopStatus':
                break;
            case 'Fullscreen':
                break;
            default:
        }
    }
}

/**
 * A class in charge of detecting new {@link HTMLMediaElement}s in current page
 *
 * @class
 */
class Page {
    constructor (source, port) {
        this.source = source;
        this.host = new Host(this, port);
        /**
         * An array holding all {@link Player}s present in the page
         *
         * @type {Array.<Player>}
         */
        this.players = [];

        /**
         *
         * @type {Player}
         */
        this.activePlayer = null;

        this._observer = new MutationObserver(m => this.onMutate(m));
    }

    registerPlayer (element) {
        // Ignore short sounds, they are most likely a chat notification sound
        // but still allow when undetermined (e.g. video stream)
        if (isNaN(element.duration) || (element.duration > 0 && element.duration < 5)) {
            return;
        }

        if (this.players.find(player => player.element === element)) {
            return;
        }

        let player = new Player(this, this.host, element);

        this.players.push(player);

        if (!player.paused) {
            this.setActivePlayer(player);
        }
    }

    observeForMedia (document) {
        this._observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    onMutate (mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (typeof node.matches !== 'function' || typeof node.querySelectorAll !== 'function') {
                    return;
                }

                // first check whether the node itself is audio/video
                if (node.matches('video,audio')) {
                    this.registerPlayer(node);
                    return;
                }

                // if not, check whether any of its children are
                node.querySelectorAll('video,audio')
                  .forEach(player => this.registerPlayer(player));
            });
        });
    }

    /**
     *
     * @param {Player} player
     */
    setActivePlayer (player) {
        this.activePlayer = player;
        this.host.start(this.activePlayer);
    }
}

const page = new Page('youtube', chrome.runtime.connect());

window.addEventListener('load', evt => {
    document.querySelectorAll('video,audio')
      .forEach(player => page.registerPlayer(player));

    page.observeForMedia(document.documentElement);
});

window.addEventListener('yt-page-data-updated', e => {
    document.querySelectorAll('video,audio')
      .forEach(player => page.registerPlayer(player));
});
