define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size) {
        this.url = url;
        this.pool = [];

        for (var i = 0; i < size; i++) {
            this._createSound();
        }

    };

    SoundPool.prototype._createSound = function() {
        this.pool.push(new SoundWrapper(this.url));
    };

    SoundPool.prototype.play = function() {
        this._createSound();
        var sw = this.pool.shift();
        sw.play();
        sw.audio = null;
    };

    return SoundPool;

});