define(['jquery', 'Bot', 'Modes/Mode'], function($, Bot, Mode) {
     // HOUSE
    var House = function() {
        Mode.apply(this, arguments);
        this._houseTop = this.ghost.y - this.ghost.getTile().h / 2;
        this._houseBottom = this.ghost.y + this.ghost.getTile().h / 2;
        this._exitTile = this.ghost.map.house.getR();
        this._exitTileX = this._exitTile.x  - this.ghost.map.tw / 2;
    };

    $.extend(House.prototype, Mode.prototype, {
        onEnter : function() {
            this._prepareExit = false;
            this.ghost._speed = 70;
        },

        resume : function() {
            if (!this._prepareExit) this._startTime += this.ghost.ts() - this._pauseTime;
        },

        getNextDirection : function() {
            
        },
        
        move : function() {
            if (!this._startTime) this._startTime = this.ghost.ts();

            var t = this.ghost.getTile();

            if (!this._prepareExit && this.ghost.ts() - this._startTime > this.ghost.waitTime && !t.isWall()) {
                this._prepareExit = true;
                this.ghost.y = t.y;
            }

            if (this.exit()) {

                this.onExit();

            } else if (this._prepareExit) {
                if (this.ghost.x < this._exitTileX) this.ghost.dir = 'r';
                else if (this.ghost.x > this._exitTileX) this.ghost.dir = 'l';
                else this.ghost.dir = 'u';

                if (this.ghost.dir === 'u') 
                    this.ghost.y -= this.ghost.getMin(this.ghost.getStep(), this.ghost.y - this._exitTile.getU().y);
                if (this.ghost.dir === 'r') 
                    this.ghost.x += this.ghost.getMin(this.ghost.getStep(), this._exitTileX - this.ghost.x);
                if (this.ghost.dir === 'l') 
                    this.ghost.x -= this.ghost.getMin(this.ghost.getStep(), this.ghost.x - this._exitTileX);

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

            return this.ghost.getTile() === this._exitTile.getU();

        },

        onExit : function() {
            this._startTime = null;

            var t = this.ghost.getTile();

            this.ghost._dir = 'l';
            this.ghost._nextDir = 'l';
            this.ghost._lastTile = t.getD();
            this.ghost._speed = this.ghost.speed;
            this.ghost.setMode();
        }
    });

    return House;
});