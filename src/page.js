/**
 * A class in charge of detecting new {@link HTMLMediaElement}s in current page
 *
 * @class
 */
class Page {
    /**
     *
     *
     * @param {Document} document
     * @param {Playback} playback
     * @param {Host} host
     */
    constructor (document, playback, host) {
        this.document = document;
        this.playback = playback;
        this.host = host;
        /**
         * An array holding all {@link Player}s present in the page
         *
         * @type {Array.<Player>}
         */
        this.players = [];

        /**
         * Upon load of a page this property can be used by providers
         * to cache html elements that are likely to be used repeatedly.
         *
         * @see {@link providers/soundcloud.js} for an example.
         *
         * @type {Object.<string, HTMLElement>}
         */
        this.elements = {};

        this._mediaObserver = new MutationObserver(m => this.onMutate(m));
        this._changesObserver = new MutationObserver(() => this.host.change());
    }

    registerPlayer (element) {
        if (this.players.find(player => player.element === element)) {
            return false;
        }

        let player = new Player(this, this.host, element);

        this.players.push(player);

        // Ignore short sounds, they are most likely a chat notification sound
        // but still allow when undetermined (e.g. video stream)
        if (player.isPlaying() && !(isNaN(element.duration) || (element.duration > 0 && element.duration < 5))) {
            this.setActivePlayer(player);
        }
        return true;
    }

    /**
     *
     * @param {Element} element
     */
    observeForMedia (element) {
        this._mediaObserver.observe(element, {
            childList: true,
            subtree: true
        });
    }

    /**
     *
     * @param {Element} element
     * @param {MutationObserverInit} options
     */
    observeForChanges (element, options = { childList: true, subtree: true }) {
        this._changesObserver.observe(element, options);
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

    checkForMediaElements () {
        this.document.querySelectorAll('video,audio')
          .forEach(player => page.registerPlayer(player));
    }

    /**
     *
     * @param {Player} player
     */
    setActivePlayer (player) {
        this.playback.setActivePlayer(player);
    }

    /**
     *
     * @returns {Player}
     */
    getActivePlayer () {
        return this.playback.activePlayer;
    }

    /**
     *
     * @returns {string}
     */
    getTitle () {
        return this.document.title;
    }

    /**
     *
     * @returns {string}
     */
    getIcon () {
        return this.document
          .querySelector('link[rel="shortcut icon"],link[rel="icon"]')
          .getAttribute('href');
    }

}
