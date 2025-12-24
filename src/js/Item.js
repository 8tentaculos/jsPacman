import Sprite from './engine/Sprite.js';

/**
 * Base Item class for game entities. Extends Sprite with map integration.
 * @class Item
 * @extends {Sprite}
 */
class Item extends Sprite {
    /**
     * Creates an instance of Item.
     * @param {Object} [options={}] - Configuration options.
     * @param {Map} [options.map] - The map instance this item belongs to.
     */
    constructor(options = {}) {
        super(options);

        if (options.map) this.map = options.map;
        // Half width and half height.
        this.offsetX = parseInt(this.width / 2);
        this.offsetY = parseInt(this.height / 2);
        // Render.
        this.render();
    }

    /**
     * Gets the tile at the item's current position.
     * @returns {Tile} The tile at the item's position.
     */
    getTile() {
        return this.map.getTile(this.x, this.y, true);
    }

    /**
     * Destroys the item and removes its element from the DOM.
     */
    destroy() {
        super.destroy().removeElement();
    }

    /**
     * Hides the item by setting display to 'none'.
     */
    hide() {
        this.el.style.display = 'none';
    }

    /**
     * Shows the item by setting display to empty string.
     */
    show() {
        this.el.style.display = '';
    }
}

export default Item;
