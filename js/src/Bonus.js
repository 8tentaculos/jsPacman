define(['jquery', 'Bot', 'gameQuery'], function($, Bot) {
    var Bonus = function(attrs) {        
        this.animations = {
            default : {},

            score_100 : {
                offsety : 29
            },

            score_200 : {
                offsetx : 29,
                offsety : 29
            },

            score_500 : {
                offsetx : 29 * 2,
                offsety : 29
            },

            score_700 : {
                offsetx : 29 * 3,
                offsety : 29
            },

            score_1000 : {
                offsetx : 29 * 4,
                offsety : 29
            },

            score_2000 : {
                offsetx : 29 * 5,
                offsety : 29
            },

            score_5000 : {
                offsetx : 29 * 6,
                offsety : 29
            }
        };
        // Call Parent.
        Bot.call(this, attrs);

        // Change tile.
        this.on('sprite:tile', $.proxy(function(e, t) {
            
            if (this.y === t.y) offset = 1;
            else offset = 2;
            if (t.col % 2) this._offsetY = -offset;
            else this._offsetY = offset;

            this._dir = this._nextDir;
            this._nextDir = this.getNextDirection();
            this._eatEvent = false;
            
        }, this));
         
    };

    $.extend(Bonus.prototype, Bot.prototype, { 
        w : 32,
        // Options.
        dir : null,
        // Overriden by Level
        speed : 40,

        pacman : null,

        score : '100',

        aniBase : {
            imageURL : 'img/misc.png',
            offsety : 0,
            offsetx : 0
        },

        move : function() {
            Bot.prototype.move.call(this, this._dir);
            // Eat or eaten!
            if (!this._eatEvent) {
                var pt = this.pacman.getTile(), t = this.getTile(), op = this._getOpDirection(this.dir);
                if (pt === t || (this.pacman.dir === op && pt === t.get(op))) {
                    this._eatEvent = true;
                    
                    this.animation =  this.animations['score_' + this.score];
                    this.render();

                    this.pacman.trigger('sprite:bonus', this);
                }
            }

            if (this.getTile() === this._getTarget()) this.trigger('sprite:bonusdestroy');
        },

        getNextDirection : function() {
            var targetTile = this._getTarget(); // Target Tile

            var _dir = this._dir || this.dir;

            var nextTile = this.getTile().get(_dir); // Next tile.

            var directions = ['u', 'l', 'd', 'r']; // Preferred direction order.

            var nextDirection, lastDistance;

            for (var i = 0; i < 4; i++) {
                var dir = directions[i];

                if (dir === this._getOpDirection(_dir)) continue; // Cant't go back. 

                if (this.canGo(dir, nextTile)) {
                    var testTile = nextTile.get(dir);
                    var distance = this.getDistance(testTile, targetTile);

                    if (typeof lastDistance === 'undefined' || lastDistance > distance) {
                        nextDirection = dir;
                        lastDistance = distance;
                    }
                }
            }

            return nextDirection;
        },

        canGo : function(dir, t) {
            if (!t) t = this.ghost.getTile();
            var nt = t.get(dir);

            if (!nt) return false;

            return !nt.isWall() && !nt.isHouse();
        },

        _getTarget : function() {
            return this.map.tunnels[0];
        },

        _setAnimation : function() {

        },

    });

    return Bonus;

});
