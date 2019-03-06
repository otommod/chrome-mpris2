/**
 * A class in charge of detecting new {@link HTMLMediaElement}s in current page
 *
 * @class
 */
class Page {
    constructor (port) {
        this.playback = new Playback(this);
        this.host = new Host(this.playback, port);
        /**
         * An array holding all {@link Player}s present in the page
         *
         * @type {Array.<Player>}
         */
        this.players = [];

        this._mediaObserver = new MutationObserver(m => this.onMutate(m));
        this._changesObserver = new MutationObserver(() => this.host.change());
    }

    registerPlayer (element) {
        if (this.players.find(player => player.element === element)) {
            return;
        }

        let player = new Player(this.playback, this.host, element);

        this.players.push(player);

        // Ignore short sounds, they are most likely a chat notification sound
        // but still allow when undetermined (e.g. video stream)
        if (player.isPlaying() && !(isNaN(element.duration) || (element.duration > 0 && element.duration < 5))) {
            this.setActivePlayer(player);
        }
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

}
