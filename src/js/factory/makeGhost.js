import Animation from '../engine/Animation.js';
import Ghost, { animations, animationBase } from '../Ghost.js';
import getDistance from '../helper/getDistance.js';

/**
 * Sprite type constant for Pinky ghost.
 * @constant {string}
 */
export const SPRITE_PINKY = 'SPRITE_PINKY';
/**
 * Sprite type constant for Blinky ghost.
 * @constant {string}
 */
export const SPRITE_BLINKY = 'SPRITE_BLINKY';
/**
 * Sprite type constant for Inky ghost.
 * @constant {string}
 */
export const SPRITE_INKY = 'SPRITE_INKY';
/**
 * Sprite type constant for Sue ghost.
 * @constant {string}
 */
export const SPRITE_SUE = 'SPRITE_SUE';

/**
 * Factory function to create a ghost with specific AI behavior based on label.
 * @param {string} label - Ghost type ('pinky', 'blinky', 'inky', 'sue').
 * @param {Object} options - Configuration options passed to Ghost constructor.
 * @returns {Ghost} A new Ghost instance with type-specific configuration.
 */
export default (label, options) => {
    // Pink Ghost
    if (label === 'pinky') {
        options = Object.assign({
            type : SPRITE_PINKY,
            dir : 'd',
            defaultAnimation : 'down',
            getChaseTarget : function() {
                var t = this.pacmanData.tile;
                var dir = this.pacmanData.dir;
                return t.get(dir).get(dir).get(dir).get(dir);
            },
            animations : {
                ...animations,
                right : new Animation({
                    ...animationBase,
                    offsetY : 252,
                    offsetX : -2
                }),

                down : new Animation({
                    ...animationBase,
                    offsetY : 252,
                    offsetX : 64 * 2 - 2
                }),

                up : new Animation({
                    ...animationBase,
                    offsetY : 252,
                    offsetX : 64 * 4 - 2
                }),

                left : new Animation({
                    ...animationBase,
                    offsetY : 252,
                    offsetX : 64 * 6 - 2
                })
            }
        }, options);
    }
    // Red Ghost
    if (label === 'blinky') {
        options = Object.assign({
            type : SPRITE_BLINKY,
            dir : 'l',
            waitTime : 0,
            scatterTarget : 25,
            defaultAnimation : 'left',
            animations : {
                ...animations,
                right : new Animation({
                    ...animationBase,
                    offsetY : 124,
                    offsetX : -2
                }),

                down : new Animation({
                    ...animationBase,
                    offsetY : 124,
                    offsetX : 64 * 2 - 2
                }),

                up : new Animation({
                    ...animationBase,
                    offsetY : 124,
                    offsetX : 64 * 4 - 2
                }),

                left : new Animation({
                    ...animationBase,
                    offsetY : 124,
                    offsetX : 64 * 6 - 2
                })
            }
        }, options);
    }
    // Cyan Ghost
    if (label === 'inky') {
        options = Object.assign({
            type : SPRITE_INKY,
            dir : 'u',
            waitTime : 6,
            scatterTarget : 979,
            defaultAnimation : 'up',
            getChaseTarget : function() {
                var pacmanTile = this.pacmanData.tile;
                var blinkyTile = this.blinky.getTile();
                var dir = this.pacmanData.dir;

                pacmanTile = pacmanTile.get(dir).get(dir); // Two tiles in front of pacman

                return this.map.getTile(pacmanTile.col + pacmanTile.col - blinkyTile.col, pacmanTile.row + pacmanTile.row - blinkyTile.row);

            },
            animations : {
                ...animations,
                right : new Animation({
                    ...animationBase,
                    offsetY : 316,
                    offsetX : -2
                }),

                down : new Animation({
                    ...animationBase,
                    offsetY : 316,
                    offsetX : 64 * 2 - 2
                }),

                up : new Animation({
                    ...animationBase,
                    offsetY : 316,
                    offsetX : 64 * 4 - 2
                }),

                left : new Animation({
                    ...animationBase,
                    offsetY : 316,
                    offsetX : 64 * 6 - 2
                })
            }
        }, options);
    }
    // Orange Ghost
    if (label === 'sue') {
        options = Object.assign({
            type : SPRITE_SUE,
            dir : 'u',
            waitTime : 8,
            scatterTarget : 953,
            defaultAnimation : 'up',
            getChaseTarget : function() {
                var t = this.pacmanData.tile;
                var d = getDistance(t, this.getTile());
                if (d > 16 * t.w) return t;
                else return this.scatterTarget;
            },
            animations : {
                ...animations,
                'right' : new Animation({
                    ...animationBase,
                    offsetY : 188,
                    offsetX : -2
                }),

                'down' : new Animation({
                    ...animationBase,
                    offsetY : 188,
                    offsetX : 64 * 2 - 2
                }),

                'up' : new Animation({
                    ...animationBase,
                    offsetY : 188,
                    offsetX : 64 * 4 - 2
                }),

                'left' : new Animation({
                    ...animationBase,
                    offsetY : 188,
                    offsetX : 64 * 6 - 2
                })
            }
        }, options);
    }

    return new Ghost(options);
};
