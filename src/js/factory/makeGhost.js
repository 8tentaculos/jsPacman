import Animation from '../engine/Animation';
import Ghost, { animations, animationBase } from '../Ghost';
import getDistance from '../helper/getDistance';

export default (label, options) => {
    // Pink Ghost
    if (label === 'pinky') {
        options = Object.assign({
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
}
