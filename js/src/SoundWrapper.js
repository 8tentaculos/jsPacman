

define(['jquery', 'gameQuery'], function($) {

    // Workaround for fast consecutive sounds:
    // dual mode uses 2 audios with same source. for alternate playing.
    // normal mode resets audio before play.
    // dual mode works better on IE (tested IE 11)
    // normal mode works better on Chrome an FF.
    var SoundWrapper = function(url, loop, dual) {
        this.audio = new Audio();

        if (dual) this._audio = new Audio();

        // start loading the sound. Should turn this.ready to true once done.
        this.load = function() {
            this.audio.src = url;
            this.audio.loop = loop;
            this.audio.load();

            if (this._audio) {
                this._audio.src = url;
                this._audio.loop = loop;
                this._audio.load();
            }
        };

        // add the sound to the manager
        $.gameQuery.resourceManager.addSound(this);

        return true;
    };

    $.extend(SoundWrapper.prototype, {
        // plays the sound if this.ready == true
        play  : function(){
            if (!this._audio && this.audio.currentTime) this.audio.currentTime = 0;
            this.audio.play();
            if (this._audio) {
                var tmp = this._audio;
                this._audio = this.audio;
                this.audio = tmp;
            }
        },

        // pauses the sound if it is playing
        pause : function(){
            this.audio.pause();
            if (this._audio) {
                this._audio.pause();
            }
        },

        // stops the sound if it is playing, rewind (even if paused)
        stop : function(){
            this.audio.pause();
            this.audio.currentTime = 0;
            if (this._audio) {
                this._audio.pause();
                this._audio.currentTime = 0;
            }
        },

        // mutes the sound without stopping it
        muted : function(mute){
            this.audio.muted = !!mute;
            if (this._audio) {
                this._audio.muted = !!mute;
            }
        },

        // returns true if the sound is ready to be played
        ready : function(){
            var ready = this.audio.readyState == this.audio.HAVE_ENOUGH_DATA;
            if (this._audio) ready = ready && this._audio.readyState == this._audio.HAVE_ENOUGH_DATA;
            return ready;
        }

    });

    // $.gameQuery = $.extend($.gameQuery, {

    // });

    $.gameQuery.SoundWrapper = SoundWrapper;

    return SoundWrapper;

});