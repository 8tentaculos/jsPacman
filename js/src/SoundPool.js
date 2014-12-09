define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size) {
        this.pool = [];
        this.url = url;

        for (var i = 0; i < size; i++) {
            this._createSound();
        }

    };

    SoundPool.prototype._createSound = function() {
        this.pool.push(new SoundWrapper(this.url));
    };

    SoundPool.prototype.play = function() {
        var sw = this.pool.shift();
        sw.play();
        if (window.chrome) {
            sw.audio = null;
            this._createSound();
        } else {
            this.pool.push(sw);
        }
        
    };

    return SoundPool;

});