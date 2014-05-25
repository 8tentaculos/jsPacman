define(['jquery', 'Bot', 'Modes', 'gameQuery'], function($, Bot, Modes) {
    var Ghost = function(attrs) {        
        this.animations = {
            frightened : {
                offsety : 188,
                offsetx : -1
            },
             
            frightenedBlink : {
                offsety : 188,
                offsetx : -1,
                numberOfFrame : 4
            },
            
            deadRight : {
                offsety : 188,
                offsetx : 32 * 4 - 1,
                numberOfFrame : 1
            },

            deadDown : {
                offsety : 188,
                offsetx : 32 * 5 - 1,
                numberOfFrame : 1
            },
            
            deadUp : {
                offsety : 188,
                offsetx : 32 * 6 - 1,
                numberOfFrame : 1
            },
            
            deadLeft : {
                offsety : 188,
                offsetx : 32 * 7 - 1,
                numberOfFrame : 1
            },

            score_200 : {
                imageURL : 'img/misc.png',
                numberOfFrame : 1,
                offsetx : -1,
                offsety : 55
            },

            score_400 : {
                imageURL : 'img/misc.png',
                numberOfFrame : 1,
                offsetx : 32 * 1 - 1,
                offsety : 55
            },

            score_800 : {
                imageURL : 'img/misc.png',
                numberOfFrame : 1,
                offsetx : 32 * 2 - 1,
                offsety : 55
            },

            score_1600 : {
                imageURL : 'img/misc.png',
                numberOfFrame : 1,
                offsetx : 32 * 3,
                offsety : 55
            }
        };
        // Call Parent.
        Bot.call(this, attrs);
        // Modes.
        this.modes = {
            scatter    : new Modes.Scatter(this),
            chase      : new Modes.Chase(this),
            frightened : new Modes.Frightened(this),
            house      : new Modes.House(this),
            dead       : new Modes.Dead(this)
        };

        this.setMode(this.mode);

        this.scatterTarget = this.map.tiles[this.scatterTarget];

        this.pg.on('game:globalmode', $.proxy(this._onGameGlobalMode, this));

        // Change tile.
        this.on('sprite:tile', $.proxy(function(e, t) {
            if (this.mode === this.modes.frightened) this._speed = this.frightenedSpeed;
            else if (this.mode === this.modes.dead) this._speed = 130;
            else if (t.isTunnel()) this._speed = this.tunnelSpeed;
            else this._speed = this.speed;

            if (this._turnBack) {
               this.dir = this._getOpDirection(this.dir);
               this._dir = null;
               this._nextDir = this.mode.getNextDirection();
               this._turnBack = false;
            } else {
                this._dir = this._nextDir;
                this._nextDir = this.mode.getNextDirection();
            }

            this._eatEvent = false;
        }, this));

        this.pacman.on('sprite:pill', $.proxy(function() { 
            this.setMode('frightened');
            this.score = 200;
        }, this));

        this.pacman.on('sprite:eat', $.proxy(function() { 
            this.score = this.scores[this.score];
        }, this));
         
    };

    $.extend(Ghost.prototype, Bot.prototype, { 
        w : 32,
        // Options.
        dir : null,
        // Overriden by Level
        speed : 75,
        frightenedTime : 5,

        waitTime : 4,

        aniBase : {
            imageURL : 'img/bots.png',
            numberOfFrame : 2, 
            delta : 32, 
            rate : 180, 
            type : $.gQ.ANIMATION_HORIZONTAL
        },

        mode : 'house',
        pacman : null,

        score : '200',
        scores : {'200' : '400', '400' : '800', '800' : '1600'},

        reset : function(attrs) {
            $.extend(this, this.defaults, attrs || {});
            this.setMode(this.mode);
            this.render(true);
        },

        pause : function() {
            this.mode.pause();
        },

        resume : function() {
            this.mode.resume();
        },

        setMode : function(mode) {
            if (typeof mode === 'string') mode = this.modes[mode];

            if (!mode) {
                if (this.frightened) {
                    this.mode = this.frightened;
                    this.frightened = null;
                    return;
                }

                mode = this.globalMode;
            }

            var house = this.modes.house, dead = this.modes.dead, frightened = this.modes.frightened;

            if (mode === frightened && (this.mode === house || this.mode === dead)) {
                this.frightened = mode;
            } else {
                this.mode = mode;
            }

            if (typeof mode.onEnter === 'function') mode.onEnter();
        },

        isFrightened : function() {
            return this.frightened || this.mode === this.modes.frightened;
        },

        isDead : function() {
            return this.mode === this.modes.dead;
        },

        getChaseTarget : function() {
            return this.pacman.getTile();
        },

        _onGameGlobalMode : function(ev, mode) {
            if (typeof mode === 'string') mode = this.modes[mode];
            this.globalMode = mode;
        },
        
        move : function() {
            this.mode.move();
            // Eat or eaten!
            if (!this._eatEvent) {
                var pt = this.pacman.getTile(), t = this.getTile(), op = this._getOpDirection(this.dir);
                if (pt === t || (this.pacman.dir === op && pt === t.get(op))) {
                    this._eatEvent = true;
                    if (this.mode === this.modes.frightened) {
                        // Ghost eaten by Pacman!
                        this.setMode('dead');
                        this.pacman.trigger('sprite:eat', this);
                    } else if (this.mode !== this.modes.dead) {
                        // Eat Pacman!
                        this.pacman.trigger('sprite:eaten', this);
                    }
                }
            }
        },

        _setAnimation : function() {
            this.mode.setAnimation();
        },

        _canGo : function(dir) {
            return this.mode.canGo(dir);
        }

    });

    return Ghost;

});
