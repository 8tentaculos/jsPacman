import { View } from 'rasti';

import {
    ANIMATION_HORIZONTAL,
    ANIMATION_VERTICAL,
    ANIMATION_ONCE,
    ANIMATION_CALLBACK,
    ANIMATION_PINGPONG
} from './Animation';

const defaults = {
    width : 32,
    height : 32,
    x : 0,
    y : 0,
    z : 0,
    offsetX : 0,
    offsetY : 0,
    idleCounter : 0,
    currentFrame : 0,
    frameIncrement : 1,
    angle : 0,
    factor :  1,
    playing : true,
    factorH : 1,
    factorV : 1,
    animations : {},
    defaultAnimation : 'default',
    normalizeRefrashRate : null,
    type : null
};

class Sprite extends View {
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });
    }

    load() {
        return Promise.all(
            Object.keys(this.animations)
                .map(label => this.animations[label].load())
        );
    }

    isReady() {
        return Object.keys(this.animations)
            .some(label => !!this.animations[label].isReady());
    }

    render() {
        Object.assign(this.el.style, {
            position : 'absolute',
            overflow : 'hidden',
            height : `${this.height}px`,
            width : `${this.width}px`,
            zIndex : this.z
        });

        this.setAnimation(this.animations[this.defaultAnimation]);

        this.transform();
    }

    refresh() {
        if (!this.animation) return;

        if ((this.idleCounter === this.normalizeRefrashRate(this.animation.refreshRate) - 1) && this.playing) {
            // Does 'this' loops?
            if (this.animation.type & ANIMATION_ONCE) {
                if (this.currentFrame < this.animation.numberOfFrame - 1) {
                    this.currentFrame += this.frameIncrement;
                } else if (this.currentFrame == this.animation.numberOfFrame - 1) {
                    // Does 'this' has a callback ?
                    if (this.animation.type & ANIMATION_CALLBACK) {
                        if (typeof this.callback === 'function'){
                            this.callback(this);
                            this.callback = null;
                        }
                    }
                }
            } else {
                if (this.animation.type & ANIMATION_PINGPONG) {
                    if (this.currentFrame === this.animation.numberOfFrame - 1 && this.frameIncrement === 1) {
                        this.frameIncrement = -1;
                    } else if (this.currentFrame === 0 && this.frameIncrement === -1) {
                        this.frameIncrement = 1;
                    }
                }

                this.currentFrame = (this.currentFrame + this.frameIncrement) % this.animation.numberOfFrame;

                if (this.currentFrame === 0) {
                    // Does 'this' has a callback ?
                    if(this.animation.type & ANIMATION_CALLBACK) {
                        if (typeof this.callback === 'function') {
                            this.callback(this);
                        }
                    }
                }
            }
            // Update the background
            if (this.animation.numberOfFrame > 1) {
                let x = 0, y = 0;

                if (this.animation.type & ANIMATION_VERTICAL) {
                    x = -this.animation.offsetX;
                    y = -this.animation.offsetY - this.animation.delta * this.currentFrame;
                } else if (this.animation.type & ANIMATION_HORIZONTAL) {
                    x = -this.animation.offsetX - this.animation.delta * this.currentFrame;
                    y = -this.animation.offsetY;
                }

                this.el.style.backgroundPosition = `${x}px ${y}px`;
            }
        }
        this.idleCounter = (this.idleCounter + 1) % this.normalizeRefrashRate(this.animation.refreshRate);
    }
    /**
     * Stop the animation at the current frame.
     */
    pauseAnimation() {
        this.playing = false;
    }
    /**
     * Resume the animation (if paused)

     */
    resumeAnimation() {
        this.playing = true;
    }
    /**
     * Changes the animation associated with a sprite.
     */
    setAnimation(animation, index, callback) {
        this.animation = animation;

        this.currentFrame = 0;
        this.frameIncrement = 1;

        this.el.style.backgroundImage = `url('${animation.imageURL}')`;

        if (animation.type & ANIMATION_VERTICAL) {
            this.el.style.backgroundRepeat = 'repeat-x';
        } else if (animation.type & ANIMATION_HORIZONTAL) {
            this.el.style.backgroundRepeat = 'repeat-y';
        } else {
            this.el.style.backgroundRepeat = 'no-repeat';
        }

        let distanceX = 0;
        let distanceY = 0;

        this.el.style.backgroundPosition = `${-distanceX - animation.offsetX}px ${-distanceY - animation.offsetY}px`;

        if (typeof callback === 'function'){
            this.callback = callback;
        }
    }
    /**
     * Internal function doing the combined actions of rotate and scale.
     * Please use .rotate() or .scale() instead since they are part of the supported API!
     */
    transform() {
        this.el.style.transform = `translate(${this.x * this.factor - this.offsetX}px, ${this.y * this.factor - this.offsetY}px) rotate(${this.angle}deg) scale(${this.factor * this.factorH}, ${this.factor * this.factorV})`;
    }
    /**
     * Rotate the element(s) clock-wise.
     *
     * @param {Number} angle the angle in degrees
     * @param {Boolean} relative or not
     */
    rotate(angle, relative) {
        if (relative === true){
            angle += this.angle;
            angle %= 360;
        }

        this.angle = parseFloat(angle);
        this.transform();
    }
    /**
     * Change the scale of the selected element(s). The passed argument is a ratio:
     *
     * @param {Number} factor a ratio: 1.0 = original size, 0.5 = half the original size etc.
     * @param {Boolean} relative or not
     */
    scale(factor, relative) {
        if (relative === true){
            factor *= this.factor;
        }
        this.factor = parseFloat(factor);
        this.transform();
    }
    /**
     * Flips the element(s) horizontally.
     */
    flipH(flip) {
        if (flip === undefined) {
            return (this.factorH !== undefined) ? (this.factorH === -1) : false;
        } else if (flip) {
            this.factorH = -1;
        } else {
            this.factorH = 1;
        }

        this.transform();
    }
    /**
     * Flips the element(s) vertically.
     */
    flipV(flip){
        if (flip === undefined) {
            return (this.factorV !== undefined) ? (this.factorV === -1) : false;
        } else if (flip) {
            this.factorV = -1;
        } else {
            this.factorV = 1;
        }

        this.transform();
    }

    setXYZ(options, relative) {
        let transform = false;

        Object.keys(options).forEach(coordinate => {
            switch (coordinate) {
                case 'x':
                    if (relative) {
                        options.x += this.x;
                    }
                    this.x = options.x;
                    transform = true;
                    break;

                case 'y':
                    if (relative) {
                        options.y += this.y;
                    }
                    this.y = options.y;
                    transform = true;
                    break;

                case 'z':
                    if(relative) {
                        options.z += this.z;
                    }
                    this.z = options.z;
                    this.el.style.zIndex = this.z;
                    break;
            }
        });

        if (transform) this.transform();
    }

    setWH(options, relative) {
        Object.keys(options).forEach(coordinate => {
            switch (coordinate) {
                case 'w':
                    if (relative) {
                        options.w += this.width;
                    }
                    this.width = options.w;
                    this.el.style.width = `${this.width}px`;
                    break;

                case 'h':
                    if(relative) {
                        options.h += this.height;
                    }
                    this.height = options.h;
                    this.el.style.height = `${this.height}px`;
                    break;
            }
        });
    }
}

Object.assign(Sprite.prototype, defaults);

export default Sprite;
