/**
 * Returns the current timestamp in milliseconds.
 * @returns {number} Current timestamp in milliseconds.
 */
export const ts = () => new Date().getTime();

/**
 * Timer class for tracking elapsed time with pause/resume functionality.
 * @class Timer
 */
class Timer {
    /**
     * Creates an instance of Timer.
     * @param {number} time - The time duration in seconds to track.
     */
    constructor(time) {
        this.time = time;
        this.start = ts();
    }

    /**
     * Pauses the timer by recording the current timestamp.
     */
    pause() {
        this.pauseTime = ts();
    }

    /**
     * Resumes the timer by adjusting the start time to account for the pause duration.
     */
    resume() {
        this.start += ts() - this.pauseTime;
    }

    /**
     * Gets the elapsed time since the timer started (excluding paused time).
     * @returns {number} Elapsed time in milliseconds.
     */
    getElapsed() {
        return ts() - this.start;
    }

    /**
     * Checks if the specified time has elapsed.
     * @param {number} [time=this.time] - The time duration in seconds to check against. Defaults to the timer's initial time.
     * @returns {boolean} True if the elapsed time exceeds the specified time, false otherwise.
     */
    isElapsed(time = this.time) {
        return this.getElapsed() > time * 1000;
    }
}

export default Timer;
