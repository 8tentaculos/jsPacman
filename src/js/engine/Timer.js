// Return time stamp in seconds.
export const ts = () => new Date().getTime() / 1000;

class Timer {
    constructor(time) {
        this.time = time;
        this.start = ts();
    }

    pause() {
        this.pauseTime = ts();
    }

    resume() {
        this.start += ts() - this.pauseTime;
    }

    getElapsed() {
        return ts() - this.start;
    }

    isElapsed() {
        return this.getElapsed() > this.time;
    }
}

export default Timer;
