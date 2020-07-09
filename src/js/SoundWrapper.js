import $ from 'jquery';
import './jquery.gamequery-0.7.1';

class SoundWrapper {
    constructor(url, loop) {
        this.audio = new Audio();

        // start loading the sound. Should turn this.ready to true once done.
        this.load = function() {
            this.audio.src = url;
            this.audio.loop = loop;
            this.audio.load();
        };

        // add the sound to the manager
        $.gameQuery.resourceManager.addSound(this);

        return true;
    }

    // plays the sound if this.ready == true
    play() {
        this.audio.play();
    }

    // pauses the sound if it is playing
    pause() {
        this.audio.pause();
    }

    // stops the sound if it is playing, rewind (even if paused)
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    // mutes the sound without stopping it
    muted(mute) {
        this.audio.muted = !!mute;
    }

    isPlaying() {
        return this.audio.currentTime !== 0 || !this.audio.ended;
    }

    // returns true if the sound is ready to be played
    ready() {
        return this.audio.readyState == this.audio.HAVE_ENOUGH_DATA;
    }
}

$.gameQuery.SoundWrapper = SoundWrapper;

export default SoundWrapper;
