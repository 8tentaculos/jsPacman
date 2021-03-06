export const ANIMATION_VERTICAL = 1; // Generated by a vertical offset of the background
export const ANIMATION_HORIZONTAL = 2; // Generated by a horizontal offset of the background
export const ANIMATION_ONCE = 4; // Played only once (else looping indefinitely)
export const ANIMATION_CALLBACK = 8; // A callback is exectued at the end of a cycle
export const ANIMATION_PINGPONG = 32; // At the last frame of the animation it reverses (if used in conjunction with ONCE it will have no effect)

const defaults = {
    // The url of the image to be used as an animation or sprite
    imageURL : null,
    // The number of frames to be displayed when playing the animation
    numberOfFrame : 1,
    // The distance in pixels between two frames
    delta : 0,
    // The rate at which the frames change in miliseconds
    refreshRate : 30,
    // The type of the animation.This is a bitwise OR of the properties.
    type : 0,
    // The x coordinate where the first sprite begins
    offsetX : 0,
    // The y coordinate where the first sprite begins
    offsetY : 0
};

class Animation {
    constructor(options) {
        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });
    }

    load() {
        this.img = new Image();
        this.img.src = this.imageURL;

        return new Promise((resolve, reject) => {
            this.img.addEventListener('load', resolve);
        });
    }

    isReady() {
        return this.img.complete;
    }
}

Object.assign(Animation.prototype, defaults);

export default Animation;
