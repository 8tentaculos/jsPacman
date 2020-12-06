import { View } from 'rasti';

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
