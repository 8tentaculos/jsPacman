define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size) {
        this.pool = [];

        for (var i = 0; i < size; i++) {
            this._createSound(url);
        }

    };

    SoundPool.prototype._createSound = function(url) {
        this.pool.push(new SoundWrapper(url));
    };

    SoundPool.prototype.play = function() {
        var sw = this.pool.shift();
        sw.play();
        this.pool.push(sw);
    };

    return SoundPool;

});