define(['jquery', 'Bot', 'gameQuery'], function($, Bot) {

    var Pacman = function(attrs) { 
        this.animations = {        
            right : {},
        
            down : {
                offsetx : 32 * 4
            },
        
            up : {
                offsetx : 32 * 8
            },
        
            left : {
                offsetx : 32 * 12
            }
        };
        
        Bot.call(this, attrs);

        // Change tile. Set direction.
        this.on('sprite:tile', $.proxy(function(e, t) {
            if (this.ghostFrightened) this._speed = this.frightenedSpeed;
            else this._speed = this.speed;

            if (t.item) {
                if (t.hasPill()) { // Pill!
                    this.trigger('sprite:pill', t);
                    this.ghostFrightened = true;
                }
                else if (t.hasDot()) { // Dot!
                    this.trigger('sprite:dot', t);
                    if (this.ghostFrightened) this._speed = this.frightenedDotSpeed;
                    else this._speed = this.dotSpeed;
                }
                t.item.destroy();
                delete t.item;
            }

        }, this));

        this.on('sprite:eaten', $.proxy(function(e, ghost) {
            this._eatenTurns = 9;
            this.dir = 'r';
            this.el.pauseAnimation();
        }, this));
    };

    $.extend(Pacman.prototype, Bot.prototype); 

    $.extend(Pacman.prototype, {
        aniBase : {
            imageURL : 'img/bots.png',
            numberOfFrame : 4, 
            delta : 32, 
            rate : 60, 
            offsety : 30,
            type : $.gQ.ANIMATION_HORIZONTAL 
        },
         
        dir : 'l',

        defaultAnimation : 'left',

        reset : function() {
            Bot.prototype.reset.apply(this);
            this._lastEatenTurnsTime = null;
        },

        move : function() {
            if (!this._eatenTurns) Bot.prototype.move.apply(this, arguments);
            else if (!this._eatenTurnsFrames) {
                if (this._eatenTurns === 9) this.trigger('sprite:die');
                if (this._eatenTurns > 2) {
                    var directions = {'d' : 'l', 'l' : 'u', 'u' : 'r', 'r' : 'd'};
                    this.dir = directions[this.dir];
                    this._setAnimation();
                    this.render();
                    this._eatenTurnsFrames = 5;
                } else this._eatenTurnsFrames = 25;

                this._eatenTurns--;
                
                if (this._eatenTurns === 0) this.trigger('sprite:life');

            } else this._eatenTurnsFrames--;
        }
     
    }); 
    
    return Pacman;

});