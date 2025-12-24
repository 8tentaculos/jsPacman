import makeBonus from './factory/makeBonus.js';

/**
 * Bonuses class that manages the display of level bonus indicators.
 * @class Bonuses
 */
class Bonuses {
    /**
     * Creates an instance of Bonuses.
     * @param {Object} options - Configuration options.
     * @param {number} options.x - X coordinate for bonus display.
     * @param {number} options.y - Y coordinate for bonus display.
     * @param {GameModel} options.model - The game model.
     * @param {Function} options.addSprite - Function to add sprites to the game.
     */
    constructor(options) {
        this.bonuses = [];

        this.x = options.x;
        this.y = options.y;

        this.model = options.model;

        for (var i = 0; i < 8; i++) {
            let bonus = makeBonus(i, {
                x : options.x - i * 64,
                y : options.y,
                factor : options.factor,
                getPacmanData : null,
                normalizeRefreshRate : () => 1
            });

            options.addSprite(bonus);
            this.bonuses.push(bonus);

            if (i >= this.model.level) this.bonuses[i].hide();
        }

        this.model.on('change:level', this.render.bind(this));
    }

    /**
     * Renders the bonus indicators based on the current level.
     */
    render() {
        for (var i = 0; i < 8; i++) {
            if (i >= this.model.level) this.bonuses[i].hide();
            else this.bonuses[i].show();
        }
    }
}

export default Bonuses;
