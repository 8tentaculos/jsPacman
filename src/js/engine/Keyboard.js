import { View } from 'rasti';

export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_LEFT = 37;

class Keyboard extends View {
    constructor(options) {
        super({
            el : document && document.body,
            ...options
        });

        this.keys = {};
    }

    onKeyUp() {
        this.keys[event.keyCode] = false;
    }

    onKeyDown() {
        this.keys[event.keyCode] = true;
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
