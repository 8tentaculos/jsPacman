define(['jquery', 'Bot', 'Modes/Mode'], function($, Bot, Mode) {
    // FRIGHTENED
    var Frightened = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Frightened.prototype, Mode.prototype, {
        onEnter : function() {
            this._startTime = this.ghost.ts();
        },

        resume : function() {
            this._startTime += this.ghost.ts() - this._pauseTime;
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
            this.ghost.pacman.ghostFrightened = false; // TODO: ugly solution for pacman to know when ghosts exits frightened mode
        }
    });

    return Frightened;
});