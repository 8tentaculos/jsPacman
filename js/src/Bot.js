define(['jquery', 'Item'], function($, Item) {
    var Bot = function(attrs) {
        Item.call(this, attrs);

        this.el.pauseAnimation();
        this._moving = false;

        this.on('sprite:move', $.proxy(function() { this.el.resumeAnimation(); }, this));
        this.on('sprite:stop', $.proxy(function() { this.el.pauseAnimation(); }, this));

        this._saveDefaults();

        this.on('sprite:tile', $.proxy(function(e, t) {
            this._setAnimation();
        }, this));

        this._speed = this.speed;
    };

    $.extend(Bot.prototype, Item.prototype);

    $.extend(Bot.prototype, {
        // Options.
        w                : 30,
        h                : 30,
        step             : 5,
        speed            : 80,
        preturn          : false,
        scatterTarget    : 3,
        // End Options.S

        pg               : null,
        map              : null,
        
        animations       : null, 
        defaultAnimation : null,

        _saveDefaults : function() {
            this.defaults = {
                x : this.x,
                y : this.y,
                animation : this.animations.default || this.animations[this.defaultAnimation],
                dir : this.dir,
                _dir : null,
                _nextDirection : null,
                mode : this.mode
            };
        },

        reset : function() {
            $.extend(this, this.defaults);
            this.render(true);
        },

        render : function(reset) {
            // Already rendered for first time.
            if (this.el) {
                var t = this.getTile();

                // Fix float point offset.
                if (Math.abs(this.y - t.y) < 1) this.y = t.y;
                if (Math.abs(this.x - t.x) < 1) this.x = t.x;

                // Position change, move.
                if (this._lastX !== this.x || this._lastY != this.y) {
                    // _offsetY stuff is for bonus movement up and down
                    if (this._offsetY == null) this._offsetY = 0; // jshint ignore:line
                    // Actually move element.
                    this.el.xy(this.x - this.hw, this.y - this.hh + this._offsetY);
                    
                    this._lastX = this.x;
                    this._lastY = this.y;

                    if (reset) {
                        this._moving = false;
                        this.el.pauseAnimation();
                    } else if (!this._moving) {
                        this.trigger('sprite:move', {x : this.x, y : this.y});
                        this._moving = true;
                    }
                } else {
                    // Not moving.
                    if (this._moving) {
                        this.trigger('sprite:stop', {x : this.x, y : this.y});
                        this._moving = false;
                    }
                }
                // Changed animation.
                if (this._lastAni !== this.animation) {
                    this.el.setAnimation(this.animation);
                    
                    this._lastAni = this.animation;
                }

            // First render ever.
            } else {
                // Call super.
                Item.prototype.render.apply(this, arguments);
            } 
        },
        // Called from Game main loop at every revolution.
        move : function(dir) {
            if (!dir) dir = this.dir;
            if (!dir) return;

            var t = this.getTile(), step, _step = this.getStep();
            // Could go that direction.
            if ((dir != this.dir || this._preturn) && this._canGo(dir)) {

                if (((dir !== this.dir && dir !== this._getOpDirection()) || this._preturn) && !this._isCentered()) {
                    // Not in the center of the tile. Befor turn, set step so on next frame we get into the center.
                    if (this._isV(dir)) {
                        var diffX = Math.abs(this.x - t.x);
                        if (this.preturn) { // Set preturn to true to turn faster on corners.
                            if (!this._isCentered('x')) {
                                if (this.x > t.x) this.x -= this.getMin(diffX, _step);
                                else this.x += this.getMin(diffX, _step);
                                this._preturn = true;
                            } else this._preturn = false;
                        } else {
                            step = this.getMin(diffX, _step);
                        }
                    }
                    if (this._isH(dir)) {
                        var diffY = Math.abs(this.y - t.y); 
                        if (this.preturn) { // Set preturn to true to turn faster on corners.
                            if (!this._isCentered('y')) {
                                if (this.y > t.y) this.y -= this.getMin(diffY, _step);
                                else this.y += this.getMin(diffY, _step);
                                this._preturn = true;
                            } else this._preturn = false;
                        } else {
                            step = this.getMin(diffY, _step);
                        }
                    }
                    
                }
                
                // No step. Means change direction.
                if (!step) {
                    this.dir = dir;
                    this._setAnimation();
                }
            }

            if (!step) {
                // Keep straight.
                if (this._canGo(this.dir)) {
                    step = _step;
                } else {
                    // Wall.
                    if (this._isV(this.dir)) { step = this.getMin(Math.abs(this.y - t.y), _step); }
                    if (this._isH(this.dir)) { step = this.getMin(Math.abs(this.x - t.x), _step); }
                }
            }

            // Move.
            if (step) {
                if (this.dir === 'u') {
                    this.y -= step;
                }
                if (this.dir === 'r') {
                    this.x += step;
                }
                if (this.dir === 'd') {
                    this.y += step;
                }
                if (this.dir === 'l') {
                    this.x -= step;
                }
            }
            // Pass away limits.
            if (this.x < 0 - this.hw) this.x = this.map.w * this.map.tw + this.hw;
            if (this.x > this.map.w * this.map.tw + this.hw) this.x = 0 - this.hw;
            if (this.y < 0 - this.hh) this.y = this.map.h * this.map.th + this.hh;
            if (this.y > this.map.h * this.map.th + this.hh) this.y = 0 - this.hh;

            t = this.getTile();

            if (t !== this._lastTile) {
                this._lastTile = t;
                this.trigger('sprite:tile', t);
            }

            this.render();
        },

        getStep : function() {
            return this.step * (this._speed / 100);
        },

        // Set animation according model conditions. Override on subclasses.
        _setAnimation : function() {
            if (this.dir === 'u') {
                this.animation = this.animations.up;
            }
            if (this.dir === 'r') {
                this.animation = this.animations.right;
            }
            if (this.dir === 'd') {
                this.animation = this.animations.down;
            }
            if (this.dir === 'l') {
                this.animation = this.animations.left;
            }
        },

        // Helper methods:
        _getOpDirection : function(dir) {
            dir = dir || this.dir;

            if (dir === 'u') return 'd';
            if (dir === 'r') return 'l';
            if (dir === 'd') return 'u';
            if (dir === 'l') return 'r';
        },
        // Tile on passed direction is available for walking.
        _canGo : function(dir) {
            var t = this.getTile();

            var nt = t.get(dir);

            return nt && !nt.isHouse() && !nt.isWall();
        },
        _isV : function(dir) {
            return dir === 'u' || dir === 'd';
        },
        _isH : function(dir) {
            return dir === 'l' || dir === 'r';
        },
        _isCentered : function(xy) {
            var t = this.getTile();
            var x = t.x === this.x, y = t.y === this.y;

            if (xy === 'x') return x;
            if (xy === 'y') return y;
            else return  x && y;
        },
        getMin : function() {
            var min = null;
            for (var i = 0, l = arguments.length; i < l; i++)
                if (min === null || arguments[i] < min) min = arguments[i];

            return min;
        }
        
    });

    return Bot; 

});