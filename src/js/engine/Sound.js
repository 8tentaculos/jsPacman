class Sound {
    constructor(url, options = {}) {
        this.pool = [];

        function makeAudio() {
            const audio = new Audio(url);
            audio.loop = !!options.loop;
            return audio;
        }

        for (var i = 0; i < options.size || 1; i++) {
            this.pool.push(makeAudio());
        }
    }

    load(callback) {
        this.pool[0].load();

        if (typeof callback === 'function') {
            this.pool[0].addEventListener('canplaythrough', callback);
        }

        return new Promise((resolve, reject) => {
            this.getAudio.addEventListener('canplaythrough', resolve);
        });
    }

    play() {
        const audio = this.pool.shift();
        audio.play();
        this.pool.push(audio);
    }

    pause() {
        this.pool[0].pause();
    }

    stop() {
        this.pool[0].pause();
        this.pool[0].currentTime = 0;
    }

    mute(muted) {
        this.pool.forEach(audio => { audio.muted = muted !== false; });
    }

    isPlaying() {
        return this.pool[0].currentTime !== 0 || !this.pool[0].ended;
    }

    isReady() {
        return this.pool[0].readyState == this.pool[0].HAVE_ENOUGH_DATA;
    }
}

export default Sound;
