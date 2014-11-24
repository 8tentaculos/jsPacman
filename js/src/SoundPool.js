define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size) {
        this.pool = [];
        this.current = 0;

        for (var i = 0; i < size; i++) {
            var sound = new SoundWrapper(url);
            this.pool.push(sound);
        }

    };

    SoundPool.prototype.play = function() {
        var sw = this.pool[this.current], audio = sw.audio;

        if (sw.isPlaying()) sw.stop();
        
        sw.play();
        
        this.current = (this.current + 1) % this.pool.length;
    };

    return SoundPool;

});