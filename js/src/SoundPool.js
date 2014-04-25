define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size, loop) {
        this.pool = [];
        this.current = 0;

        for (var i = 0; i < size; i++) {
            var sound = new SoundWrapper(url, loop);
            this.pool.push(sound);
        }

    };


    SoundPool.prototype.play = function() {
        var audio = this.pool[this.current].audio;
        if (audio.currentTime === 0 || audio.ended) {
            audio.play();
        }
        this.current = (this.current + 1) % this.pool.length;
    };

    return SoundPool;

});