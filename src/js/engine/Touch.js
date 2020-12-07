import { View } from 'rasti';

export const EVENT_SWIPE = 'swipe';

export const EVENT_SWIPE_UP = 'swipe:up';
export const EVENT_SWIPE_RIGHT = 'swipe:right';
export const EVENT_SWIPE_DOWN = 'swipe:down';
export const EVENT_SWIPE_LEFT = 'swipe:left';

const defaults = {
    threshold : 100, // required min distance traveled to be considered swipe
    restraint : 150, // maximum distance allowed at the same time in perpendicular direction
    allowedTime : 400 // maximum time allowed to travel that distance
};

class Touch extends View {
    constructor(options = {}) {
        super({
            ...options,
            el : options.el || (document && document.body)
        });

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        this.el.addEventListener('touchstart', this.onTouchStart, false);
        this.el.addEventListener('touchend', this.onTouchEnd, false);
    }

    onDestroy() {
        this.el.removeEventListener('touchstart', this.onTouchStart);
        this.el.removeEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart(event) {
        const touch = event.changedTouches[0];

        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.startTime = new Date(); // record time when finger first makes contact with surface
    }

    onTouchEnd(event) {
        let type = null;

        const touch = event.changedTouches[0];

        const distX = touch.pageX - this.startX; // get horizontal dist traveled by finger while in contact with surface
        const distY = touch.pageY - this.startY; // get vertical dist traveled by finger while in contact with surface
        const elapsedTime = new Date() - this.startTime; // get time elapsed

        if (elapsedTime <= this.allowedTime) { // first condition for awipe met
            if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) { // 2nd condition for horizontal swipe met
                type = (distX < 0) ? EVENT_SWIPE_LEFT : EVENT_SWIPE_RIGHT; // if dist traveled is negative, it indicates left swipe
            }

            else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) { // 2nd condition for vertical swipe met
                type = (distY < 0) ? EVENT_SWIPE_UP : EVENT_SWIPE_DOWN; // if dist traveled is negative, it indicates up swipe
            }

            this.emit(EVENT_SWIPE, type, event);
        }
    }
}

Object.assign(Touch.prototype, defaults);

export default Touch;
