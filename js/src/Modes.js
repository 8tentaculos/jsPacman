define(['jquery', 'Bot'], function($, Bot) {
     var Mode = function(ghost) {
        this.ghost = ghost;
    };

    $.extend(Mode.prototype, {
        move : function() {
            if (this.exit()) this.onExit();
            else {
                Bot.prototype.move.call(this.ghost, this.ghost._dir);
            }
        },

        getNextDirection : function() {
            var targetTile = this._getTarget(); // Target Tile

            var _dir = this.ghost._dir || this.ghost.dir;

            var nextTile = this.ghost.getTile().get(_dir); // Next tile.
   
            var directions = ['u', 'l', 'd', 'r']; // Preferred direction order.

            var nextDirection, lastDistance;

            for (var i = 0; i < 4; i++) {
                var dir = directions[i];

                if (dir === this.ghost._getOpDirection(_dir)) continue; // Cant't go back. 

                if (this.canGo(dir, nextTile)) {
                    var testTile = nextTile.get(dir);
                    var distance = this.ghost.getDistance(testTile, targetTile);

                    if (!lastDistance || lastDistance > distance) {
                        nextDirection = dir;
                        lastDistance = distance;
                    }
                }
            }

            return nextDirection;
        }, 

        _getTarget : function() {
            //
        },

        setAnimation : function() {
            Bot.prototype._setAnimation.call(this.ghost);
        },

        canGo : function(dir, t) {
            if (!t) t = this.ghost.getTile();
            var nt = t.get(dir);

            if (!nt) return false;

            return !nt.isWall() && !nt.isHouse();
        },
        exit : function() {
            if (this.ghost.mode != this.ghost.globalMode) return true;
            return false;
        },
        onExit : function() {
            var t = this.ghost.getTile();
            if (!t.isHouse()) {
                this.ghost._turnBack = true;
            }
            this.ghost.setMode();
        } 
    });

    // HOUSE
    var House = function() {
        Mode.apply(this, arguments);
    };

    $.extend(House.prototype, Mode.prototype, {
        onEnter : function() {
            this._prepareExit = false;
            this.ghost._lastEatTime = this.ghost.ts();
            this.ghost._speed = this.ghost.speed;
            if (!this._houseTop) this._houseTop = this.ghost.y - this.ghost.getTile().h / 2;
            if (!this._houseBottom) this._houseBottom = this.ghost.y + this.ghost.getTile().h / 2;
        },

        getNextDirection : function() {
            
        },
        
        move : function() {
            var t = this.ghost.getTile();

            if (!this._prepareExit && this.ghost.ts() - this.ghost._lastEatTime > this.ghost.lastEatTimeLimit && !t.isWall()) {
                this._prepareExit = true;

                this.ghost.x = t.x;
                this.ghost.y = t.y;
            }

            if (this.exit()) {

                this.onExit();

            } else if (this._prepareExit) {
                if (this.ghost.x < this.ghost.map.house.x) this.ghost.dir = 'r';
                else if (this.ghost.x > this.ghost.map.house.x) this.ghost.dir = 'l';
                else this.ghost.dir = 'u';

                if (this.ghost.dir === 'u') 
                    this.ghost.y -= this.ghost.getMin(this.ghost.getStep(), this.ghost.y - this.ghost.map.house.getU().y);
                if (this.ghost.dir === 'r') 
                    this.ghost.x += this.ghost.getMin(this.ghost.getStep(), this.ghost.map.houseCenter.x - this.ghost.x);
                if (this.ghost.dir === 'l') 
                    this.ghost.x -= this.ghost.getMin(this.ghost.getStep(), this.ghost.x - this.ghost.map.houseCenter.x );

                this.setAnimation();

                this.ghost.render();

            } else {

                if (this.ghost.y <= this._houseTop && this.ghost.dir === 'u') this.ghost.dir = 'd';
                if (this.ghost.y >= this._houseBottom && this.ghost.dir === 'd') this.ghost.dir = 'u'; 
                
                if (this.ghost.dir === 'u') 
                    this.ghost.y -= this.ghost.getMin(this.ghost.getStep(), this.ghost.y - this._houseTop);
                if (this.ghost.dir === 'd') 
                    this.ghost.y += this.ghost.getMin(this.ghost.getStep(), this._houseBottom - this.ghost.y);

                this.setAnimation();

                this.ghost.render();

            }
        },

        setAnimation : function() {
            if (this.ghost.frightened) this.ghost.frightened.setAnimation();
            else Bot.prototype._setAnimation.call(this.ghost);
        },

        exit : function() {
            if (this.ghost.frightened && this.ghost.frightened.exit()) {
                this.ghost.frightened = null;
            }

            return this.ghost.getTile() === this.ghost.map.house.getU();

        },

        onExit : function() {
            var t = this.ghost.getTile();
            this.ghost._dir = 'l';
            this.ghost._nextDir = 'l';
            this.ghost._lastTile = t.getD();
            this.ghost.setMode();
        }
    });

    // FRIGHTENED
    var Frightened = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Frightened.prototype, Mode.prototype, {
        onEnter : function() {
            this._startTime = this.ghost.ts();
        },
        getNextDirection : function() {
            var nextTile = this.ghost.getTile().get(this.ghost._dir); // Next tile.

            var directions = ['u', 'r', 'd', 'l', 'u', 'r', 'd', 'l']; // Clockwise direction order.

            // Select random direction. Then try that direction or change following clockwise order.
            var idx = this.ghost.rnd(4);

            var nextDirection = directions[idx];

            while (nextDirection && (nextDirection === this.ghost._getOpDirection(this.ghost._dir)  || !this.canGo(nextDirection, nextTile))) {
                nextDirection = directions[++idx];
            }

            return nextDirection;
        },
        setAnimation : function() {
            if (this.ghost.frightenedTime - this.ghost.frightenedTime * 0.2 > this.ghost.ts() - this._startTime) {
                this.ghost.animation = this.ghost.animations.frightened;
            } else 
                this.ghost.animation = this.ghost.animations.frightenedBlink;
        },
        exit : function() {
            if (this.ghost.frightenedTime > this.ghost.ts() - this._startTime) return false;
            return true;
        },
        onExit : function() {
            if (!this.ghost.frightened) this.ghost.setMode();
            this.ghost.pacman.frightened = false; // TODO: ugly solution for pacman to know when ghosts exits frightened mode
        }
    });

    // SCATER
    var Scatter = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Scatter.prototype, Mode.prototype, {
        _getTarget : function() {
            return this.ghost.scatterTarget;
        }
    });

    // CHASE
    var Chase = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Chase.prototype, Mode.prototype, {
        _getTarget : function() {
            return this.ghost.getChaseTarget();
        }
    });

    // DEAD
    var Dead = function(ghost) {
        Mode.apply(this, arguments);
        this.target = this.ghost.map.getTile(this.ghost.map.houseCenter.x, this.ghost.map.houseCenter.y, true);
    };

    $.extend(Dead.prototype, Mode.prototype, {
        onEnter : function() {
            this.ghost.animation =  this.ghost.animations['score_' + this.ghost.score];
            this.ghost.render();
        },
        setAnimation : function() {
            if (this.ghost.dir === 'u') {
                this.ghost.animation = this.ghost.animations.deadUp;
            }
            if (this.ghost.dir === 'r') {
                this.ghost.animation = this.ghost.animations.deadRight;
            }
            if (this.ghost.dir === 'd') {
                this.ghost.animation = this.ghost.animations.deadDown;
            }
            if (this.ghost.dir === 'l') {
                this.ghost.animation = this.ghost.animations.deadLeft;
            }
        },
        _getTarget : function() {
            return this.target;
        },
        canGo : function(dir, t) {
            if (!t) t = this.ghost.getTile();

            var nt = t.get(dir);

            return !nt || !nt.isWall();
        },
        getStep : function() {
            return Bot.prototype.getStep.call(this.ghost) * 2;
        },
        exit : function() {
            return this.ghost.getTile() === this._getTarget();
        },
        onExit : function() {
            this.ghost.reset();
        }
    });

    return {
        Scatter : Scatter,
        Chase : Chase,
        Frightened : Frightened,
        House : House,
        Dead : Dead
    };
});