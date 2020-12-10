// Single AudioContext for all sounds.
let audioCtx;
let gainNode;

// Polyfill decodeAudioData Promise-based syntax on safari.
const decodeAudioData = (arrayBuffer) => new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(arrayBuffer, resolve, reject);
});

class Sound {
    constructor(url) {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
        }

        this.url = url;
    }

    load() {
        fetch(this.url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer
                return Promise.resolve(audioBuffer);
            });
    }

    play() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const trackSource = audioCtx.createBufferSource();
        trackSource.buffer = this.audioBuffer;
        trackSource.connect(gainNode);
        trackSource.start();
    }

    mute(muted) {
        // Muted my default unless muted === false.
        this.muted = muted !== false;

        if (this.muted) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        } else {
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        }
    }

    isReady() {
        return !!this.audioBuffer;
    }
}

export default Sound;
