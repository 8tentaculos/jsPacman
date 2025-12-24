import Pacman from './Pacman.js';

/**
 * Lives class that manages the display of remaining lives.
 * @class Lives
 */
class Lives  {
    /**
     * Creates an instance of Lives.
     * @param {Object} options - Configuration options.
     * @param {number} options.x - X coordinate for lives display.
     * @param {number} options.y - Y coordinate for lives display.
     * @param {GameModel} options.model - The game model.
     * @param {number} options.factor - Scaling factor.
     * @param {Function} options.addSprite - Function to add sprites to the game.
     */
    constructor(options) {
        this.pacmans = [];

        this.model = options.model;

        for (var i = 0; i < 5; i++) {
            let pacman = new Pacman({
                x : options.x + i * 70,
                y : options.y,
                factor : options.factor,
                defaultAnimation : 'right',
                addGameGhostEatEventListener : () => {},
                addGameGhostModeFrightenedEnter : () => {},
                addGameGhostModeFrightenedExit : () => {},
                normalizeRefreshRate : () => 1
            });

            options.addSprite(pacman);
            this.pacmans.push(pacman);

            if (i > this.model.lives - 2) this.pacmans[i].hide();
        }

        this.model.on('change:lives', this.render.bind(this));
    }

    /**
     * Renders the lives indicators based on remaining lives.
     */
    render() {
        for (var i = 0; i < 5; i++) {
            if (i > this.model.lives - 2) this.pacmans[i].hide();
            else this.pacmans[i].show();
        }
    }
}

export default Lives;
