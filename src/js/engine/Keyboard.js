import { View } from 'rasti';

export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_LEFT = 37;

export const EVENT_KEY_UP = 'keyup';
export const EVENT_KEY_DOWN = 'keydown';

class Keyboard extends View {
    constructor(options) {
        super({
            el : document && document.body,
            ...options
        });

        this.keys = {};
    }

    onKeyUp(event) {
        this.keys[event.keyCode] = false;
        this.emit(EVENT_KEY_UP, event);
    }

    onKeyDown(event) {
        this.keys[event.keyCode] = true;
        this.emit(EVENT_KEY_DOWN, event);
    }

    clear() {
        this.keys = {};
    }
}

Keyboard.prototype.events = {
    keyup : 'onKeyUp',
    keydown : 'onKeyDown'
};

export default Keyboard;
