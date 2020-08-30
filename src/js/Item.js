import Sprite from './engine/Sprite';

class Item extends Sprite {
    constructor(options = {}) {
        super(options);

        if (options.map) this.map = options.map;
        // Half width and half height.
        this.offsetX = parseInt(this.width / 2);
        this.offsetY = parseInt(this.height / 2);
        // Render.
        this.render();
    }

    getTile() {
        return this.map.getTile(this.x, this.y, true);
    }

    destroy() {
        super.destroy({ remove : true });
    }

    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = '';
    }
}

export default Item;
