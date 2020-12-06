import { View } from 'rasti';

export const SWIPE_UP = 'swipe:up';
export const SWIPE_RIGHT = 'swipe:right';
export const SWIPE_DOWN = 'swipe:down';
export const SWIPE_LEFT = 'swipe:left';

const defaults = {
    threshold : 100, // required min distance traveled to be considered swipe
    restraint : 150, // maximum distance allowed at the same time in perpendicular direction
    allowedTime : 400, // maximum time allowed to travel that distance
    onSwipe : null
};

class Touch {
    constructor(options) {
        this.el = options.el || document && document.body;

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });

        this.el.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.el.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    onTouchStart(ev) {
        const touch = ev.changedTouches[0];

        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.startTime = new Date(); // record time when finger first makes contact with surface
    }

    onTouchEnd(ev) {
        let type = null;

        const touch = ev.changedTouches[0];

        const distX = touch.pageX - this.startX; // get horizontal dist traveled by finger while in contact with surface
        const distY = touch.pageY - this.startY; // get vertical dist traveled by finger while in contact with surface
        const elapsedTime = new Date() - this.startTime; // get time elapsed

        if (elapsedTime <= this.allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) { // 2nd condition for horizontal swipe met
                type = (distX < 0) ? SWIPE_LEFT : SWIPE_RIGHT; // if dist traveled is negative, it indicates left swipe
            }

            else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) { // 2nd condition for vertical swipe met
                type = (distY < 0) ? SWIPE_UP : SWIPE_DOWN; // if dist traveled is negative, it indicates up swipe
            }

            if (typeof this.onSwipe === 'function') this.onSwipe(type, ev);
        }
    }
}

Object.assign(Touch.prototype, defaults);

export default Touch;
