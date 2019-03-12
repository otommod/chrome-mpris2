/**
 *
 * This file adds support for Soundcloud specific playback
 *
 * by extending and overriding the classes {@link Page},
 * {@link Playback}, and {@link Player}.
 * we can define how we'll interact with the site
 *
 *
 */

/**
 * SoundCloud Player
 */
class SoundCloudPlayer extends Player {

    getId () {
        return (this.page.elements.title && this.page.elements.title.textContent) ||
          super.getTitle();
    }

    getLength () {
        if (this.page.elements.progress) {
            return Math.trunc(this.page.elements.progress.getAttribute('aria-valuemax') * 1e6);
        } else
            return super.getLength();
    }

    getCover () {
        if (this.page.elements.avatar) {
            return this.page.elements.avatar.style.backgroundImage
              .slice(5, -2) //remove url( )
              .replace('t50x50', 't500x500'); //we want the big thumbnail
        } else
            return super.getCover();
    }

    getTitle () {
        let title = this.page.elements.title.lastElementChild;
        return (title && title.textContent) || super.getTitle();
    }

    getArtists () {
        return (this.page.elements.artists && [this.page.elements.artists.textContent]) ||
          super.getArtists();
    }

}

Player = SoundCloudPlayer;

/**
 * SoundCloud Playback
 */
class SoundCloudPlayback extends Playback {

    setVolume (volume) {
        super.setVolume(volume);
        let btn = this.controls.volumeButton;
        let icon = btn.parentElement.parentElement;
        if (volume === 0)
            icon && icon.classList.add('muted');
        else
            icon && icon.classList.remove('muted');

        if (this.controls.volumeHandle) {
            this.controls.volumeHandle.style.top = `${102 - 92 * volume}px`;
            this.controls.volumeProgress.style.height = `${92 * volume}px`;
        }
    }

    canGoNext () {
        return !!this.controls.nextButton;
    }

    canGoPrevious () {
        return !!this.controls.previousButton;
    }

    next () {
        this.controls.nextButton.click();
    }

    previous () {
        this.controls.previousButton.click();
    }

    isShuffle () {
        return this.controls.shuffleButton &&
          this.controls.shuffleButton.classList.contains('m-shuffling');
    }

    setShuffle (isShuffle) {
        if (this.controls.shuffleButton) {
            if ((!this.isShuffle() && isShuffle) || (this.isShuffle() && !isShuffle))
                this.controls.shuffleButton.click();
        }
    }

    setRate (rate) {
        // the soundcloud UI doesn't expose any rate controls so I don't think
        // it'd be a good idea to expose them through MPRIS; users couldn't
        // change them back from the webpage
    }

    getLoopStatus () {
        if (this.controls.repeatButton.classList.contains('m-all')) {
            return LoopStatus.PLAYLIST;
        } else if (this.controls.repeatButton.classList.contains('m-one')) {
            return LoopStatus.TRACK;
        } else {
            return LoopStatus.NONE;
        }
    }

    setLoopStatus (status) {
        if (this.controls.repeatButton)
            this.controls.repeatButton.click();
    }

}

Playback = SoundCloudPlayback;

window.addEventListener('mpris2-setup', function () {
    page.playback.controls = {
        shuffleButton: document.querySelector('.shuffleControl'),
        repeatButton: document.querySelector('.repeatControl'),
        nextButton: document.querySelector('.skipControl__next'),
        previousButton: document.querySelector('.skipControl__previous'),
        volumeButton: document.querySelector('.volume__button'),
        volumeHandle: document.querySelector('.volume__sliderHandle'),
        volumeProgress: document.querySelector('.volume__sliderProgress')
    };

    page.elements = {
        title: document.querySelector('.playbackSoundBadge__titleLink'),
        progress: document.querySelector('.playbackTimeline__progressWrapper'),
        avatar: document.querySelector('.playbackSoundBadge__avatar span'),
        artists: document.querySelector('.playbackSoundBadge__lightLink')
    };

    const observer = new MutationObserver(() => {
        Object.assign(page.elements, {
            title: document.querySelector('.playbackSoundBadge__titleLink'),
            progress: document.querySelector('.playbackTimeline__progressWrapper'),
            avatar: document.querySelector('.playbackSoundBadge__avatar span'),
            artists: document.querySelector('.playbackSoundBadge__lightLink')
        });
    });
    observer.observe(document.querySelector('.playControls__soundBadge'), {
        subtree: true,
        childList: true
    });

    page.playback.controls.shuffleButton
      .addEventListener('click', () => page.host.change());
    page.playback.controls.repeatButton
      .addEventListener('click', () => page.host.change());
});
