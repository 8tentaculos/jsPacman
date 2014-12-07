define(['jquery', 'SoundWrapper'], function($, SoundWrapper) {

    var SoundPool = function(url, size) {
        this.url = url;
        this.pool = [];
        this.current = 0;

        for (var i = 0; i < size; i++) {
            this._createSound();
        }

    };

    SoundPool.prototype._createSound = function() {
        this.pool.push(new SoundWrapper(this.url));
    };

    SoundPool.prototype.play = function() {
        var sw = this.pool[this.current];

        this._createSound();
        
        sw.play();
        
        this.current++;
    };

    return SoundPool;

});