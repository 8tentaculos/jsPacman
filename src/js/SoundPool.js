import $ from 'jquery';
import SoundWrapper from './SoundWrapper';

class SoundPool {
    constructor(url, size) {
        this.pool = [];
        this.url = url;

        for (var i = 0; i < size; i++) {
            this._createSound();
        }
    }

    _createSound() {
        this.pool.push(new SoundWrapper(this.url));
    }

    play() {
        var sw = this.pool.shift();
        sw.play();
        this.pool.push(sw);
    }
}

export default SoundPool;
