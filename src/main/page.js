/**
 * A class in charge of detecting new {@link HTMLMediaElement}s in current page
 * and registering them as players.
 *
 * The expected usage is call {@link checkForMediaElements} and {@link observeForMedia}
 * upon window.load event.
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
        /**
         * The current document to keep as context
         * @type {Document}
         */
        this.document = document;

        /**
         * Current {@link Playback} on the page
         * @type {Playback}
         */
        this.playback = playback;

        /**
         * Current {@link Host} to trigger changes
         * @type {Host}
         */
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
         * @see src/providers/soundcloud.js - for an example.
         *
         * @type {Object.<string, HTMLElement>}
         */
        this.elements = {};

        /**
         * An observer for added media elements
         * use {@link observeForMedia} to observer elements
         *
         * @type {MutationObserver}
         * @private
         */
        this._mediaObserver = new MutationObserver(m => this.onMutate(m));

        /**
         * An observer to trigger change events on the host
         * use {@link observeForChanges} to add elements
         *
         * @type {MutationObserver}
         * @private
         */
        this._changesObserver = new MutationObserver(() => this.host.change());
    }

    /**
     * Take the element and add it to the list of players
     * if it's not already there
     *
     * Use when detecting a new element on the DOM
     *
     * If the element is playing it will be set as the active player.
     *
     * @param element
     * @return {boolean}
     */
    registerPlayer (element) {
        if (this.players.find(player => player.element === element)) {
            return false;
        }

        if (isNaN(element.duration) || (element.duration > 0 && element.duration < 5)) {
            return false;
        }

        let player = new Player(this, this.host, element);

        this.players.push(player);

        // Ignore short sounds, they are most likely a chat notification sound
        // but still allow when undetermined (e.g. video stream)
        if (player.isPlaying()) {
            this.setActivePlayer(player);
        }
        return true;
    }

    /**
     * Set element to be observed by {@link this._mediaObserver}
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
     * Set element to be observed by {@link this._changesObserver}
     * by default check for any changes to itself or it's children
     *
     * @param {Element} element
     * @param {MutationObserverInit} options
     */
    observeForChanges (element, options = { childList: true, subtree: true }) {
        this._changesObserver.observe(element, options);
    }

    /**
     * Callback called by {@link this._mediaObserver}
     * Given an array of mutations check if there where any added nodes that are media
     *
     * @param {Array<MutationRecord>} mutations
     */
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
     * Search DOM for any &lt;video&gt; or &lt;audio&gt; elements
     */
    checkForMediaElements () {
        this.document.querySelectorAll('video,audio')
          .forEach(player => page.registerPlayer(player));
    }

    /**
     * Set the playback's active player
     *
     * @param {Player} player
     */
    setActivePlayer (player) {
        this.playback.setActivePlayer(player);
    }

    /**
     * Get the playbacks active player
     *
     * @returns {Player}
     */
    getActivePlayer () {
        return this.playback.activePlayer;
    }

    /**
     * Get the page's title
     *
     * @returns {string}
     */
    getTitle () {
        return this.document.title;
    }

    /**
     * Get the page's favicon
     *
     * @returns {string}
     */
    getIcon () {
        return this.document
          .querySelector('link[rel="shortcut icon"],link[rel="icon"]')
          .getAttribute('href');
    }

}
