import $ from 'jquery';
import Ghost from '../Ghost';

export default function(attrs) {
    if (!attrs) attrs = { id : 'bot-pinky' };
    // Pink Ghost
    if (attrs.id === 'bot-pinky') {
        attrs = Object.assign({
            dir : 'd',
            defaultAnimation : 'down',
            getChaseTarget : function() {
                var t = this.pacman.getTile();
                var dir = this.pacman.dir;
                return t.get(dir).get(dir).get(dir).get(dir);
            },
            animations : {
                right : {
                    offsety : 252,
                    offsetx : -2
                },

                down : {
                    offsety : 252,
                    offsetx : 64 * 2 - 2
                },

                up : {
                    offsety : 252,
                    offsetx : 64 * 4 - 2
                },

                left : {
                    offsety : 252,
                    offsetx : 64 * 6 - 2
                }
            }
        }, attrs);
    }
    // Red Ghost
    if (attrs.id === 'bot-blinky') {
        attrs = Object.assign({
            dir : 'l',
            waitTime : 0,
            scatterTarget : 25,
            defaultAnimation : 'left',
            animations : {
                right : {
                    offsety : 124,
                    offsetx : -2
                },

                down : {
                    offsety : 124,
                    offsetx : 64 * 2 - 2
                },

                up : {
                    offsety : 124,
                    offsetx : 64 * 4 - 2
                },

                left : {
                    offsety : 124,
                    offsetx : 64 * 6 - 2
                }
            }
        }, attrs);
    }
    // Cyan Ghost
    if (attrs.id === 'bot-inky') {
        attrs = Object.assign({
            dir : 'u',
            waitTime : 6,
            scatterTarget : 979,
            defaultAnimation : 'up',
            getChaseTarget : function() {
                var pt = this.pacman.getTile();
                var bt = this.blinky.getTile();
                var dir = this.pacman.dir;

                pt = pt.get(dir).get(dir); // Two tiles in front of pacman

                return this.map.getTile(pt.col + pt.col - bt.col, pt.row + pt.row - bt.row);

            },
            animations : {
                right : {
                    offsety : 316,
                    offsetx : -2
                },

                down : {
                    offsety : 316,
                    offsetx : 64 * 2 - 2
                },

                up : {
                    offsety : 316,
                    offsetx : 64 * 4 - 2
                },

                left : {
                    offsety : 316,
                    offsetx : 64 * 6 - 2
                }
            }

        }, attrs);
    }

    // Orange Ghost
    if (attrs.id === 'bot-sue') {
        attrs = Object.assign({
            dir : 'u',
            waitTime : 8,
            scatterTarget : 953,
            defaultAnimation : 'up',
            getChaseTarget : function() {
                var t = this.pacman.getTile();
                var d = this.getDistance(t, this.getTile());
                if (d > 16 * t.w) return t;
                else return this.scatterTarget;
            },
            animations : {
                right : {
                    offsety : 188,
                    offsetx : -2
                },

                down : {
                    offsety : 188,
                    offsetx : 64 * 2 - 2
                },

                up : {
                    offsety : 188,
                    offsetx : 64 * 4 - 2
                },

                left : {
                    offsety : 188,
                    offsetx : 64 * 6 - 2
                }
           }

        }, attrs);
    }

    return new Ghost(attrs);

}
