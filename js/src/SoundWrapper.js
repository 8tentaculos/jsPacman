

define(['jquery', 'gameQuery'], function($) {

    var SoundWrapper = function(url, loop) {
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
    };

    $.extend(SoundWrapper.prototype, {
        // plays the sound if this.ready == true
        play  : function() {
            this.audio.play();
        },

        // pauses the sound if it is playing
        pause : function() {
            this.audio.pause();
        },

        // stops the sound if it is playing, rewind (even if paused)
        stop : function() {
            this.audio.pause();
            this.audio.currentTime = 0;
        },

        // mutes the sound without stopping it
        muted : function(mute) {
            this.audio.muted = !!mute;
        },

        isPlaying : function() {
            return this.audio.currentTime !== 0 || !this.audio.ended;
        },

        // returns true if the sound is ready to be played
        ready : function() {
            return this.audio.readyState == this.audio.HAVE_ENOUGH_DATA;
        }

    });

    // $.gameQuery = $.extend($.gameQuery, {

    // });

    $.gameQuery.SoundWrapper = SoundWrapper;

    return SoundWrapper;

});