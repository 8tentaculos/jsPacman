// Single AudioContext for all sounds.
/** @type {AudioContext} */
let audioCtx;
/** @type {GainNode} */
let gainNode;

/**
 * Polyfill for decodeAudioData with Promise-based syntax (for Safari compatibility).
 * @param {ArrayBuffer} arrayBuffer - The audio data to decode.
 * @returns {Promise} Promise that resolves with the decoded AudioBuffer.
 */
const decodeAudioData = (arrayBuffer) => new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(arrayBuffer, resolve, reject);
});

/**
 * Sound class for loading and playing audio files using Web Audio API.
 * @class Sound
 */
class Sound {
    /**
     * Creates an instance of Sound.
     * @param {string} url - URL of the audio file to load.
     */
    constructor(url) {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
        }

        this.url = url;
    }

    /**
     * Loads the audio file from the URL and decodes it into an AudioBuffer.
     * @returns {Promise} Promise that resolves with the AudioBuffer when the audio is loaded and decoded.
     */
    load() {
        fetch(this.url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.audioBuffer = audioBuffer;
                return Promise.resolve(audioBuffer);
            });
    }

    /**
     * Plays the loaded audio sound.
     * Resumes the AudioContext if it's suspended.
     */
    play() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const trackSource = audioCtx.createBufferSource();
        trackSource.buffer = this.audioBuffer;
        trackSource.connect(gainNode);
        trackSource.start();
    }

    /**
     * Mutes or unmutes all sounds by adjusting the gain node.
     * @param {boolean} [muted=true] - If true, mutes sound; if false, unmutes. Defaults to true.
     */
    mute(muted) {
        // Muted my default unless muted === false.
        this.muted = muted !== false;

        if (this.muted) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        } else {
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        }
    }

    /**
     * Checks if the audio buffer has been loaded and is ready to play.
     * @returns {boolean} True if the audio buffer exists, false otherwise.
     */
    isReady() {
        return !!this.audioBuffer;
    }
}

export default Sound;
