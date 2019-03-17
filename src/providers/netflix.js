/**
 *
 * This file adds support for Netflix specific playback
 *
 * by extending and overriding the classes {@link Page},
 * {@link Playback}, and {@link Player}.
 * we can define how we'll interact with the site
 *
 *
 */

/**
 * Netflix Player
 */
class NetflixPlayer extends Player {

    getId () {
        return this.URL.searchParams.get('trackId');
    }

    getTitle () {
        let spans = Array.prototype.slice.call(document.querySelectorAll('.video-title span'));
        return (spans && spans.reduce((acc, cur) => (acc.textContent || acc) + ' ' + cur.textContent, '')) || super.getTitle();
    }

    getArtists () {
        let h4 = document.querySelector('.video-title h4');
        return (h4 && [h4.textContent]) || super.getArtists();
    }

    isValid () {
        return this.URL.pathname.includes('/watch') && super.isValid();
    }

}

Player = NetflixPlayer;

/**
 * Netflix Playback
 */
class NetflixPlayback extends Playback {

    seek (offset) {
        let btn;
        if (offset > 0)
            btn = document.querySelector('.button-nfplayerFastForward');
        else if (offset < 0)
            btn = document.querySelector('.button-nfplayerBackTen');

        btn && btn.click();
    }

    canGoNext () {
        return !!document.querySelector('.button-nfplayerNextEpisode');
    }

    next () {
        let btn;
        btn = document.querySelector('.skip-credits a');
        if (!btn)
            btn = document.querySelector('.button-nfplayerNextEpisode');
        btn && btn.click();
    }

    setPosition (id, position) {
        //disabled
    }

    setRate (rate) {
        //disabled
    }

    setLoopStatus (status) {
        //disabled
    }

}

Playback = NetflixPlayback;

/**
 * Netflix Page
 */
class NetflixPage extends Page {

    registerPlayer (element) {
        let result = super.registerPlayer(element);
        if (result) {
            let btn = document.querySelector('.button-nfplayerBack');
            btn && btn.addEventListener('click', () => host.quit());
        }
        return result;
    }

}

Page = NetflixPage;
