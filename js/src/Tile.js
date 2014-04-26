define(['jquery'], function($) {

    var Tile = function(code, col, row, map) {
        this.code = code;
        
        this.col = col;
        this.row = row;
        
        this.map = map;
        
        this.w = 16;
        this.h = 16;
        
        if (this.isExit() || this.isHouse()) {
            this.x = this.col * this.w +1; 
        } else this.x = this.col * this.w + parseInt(this.w / 2);

        this.y = this.row * this.h + parseInt(this.h / 2) + 1; // Original Pacman has tile's center at x : 4, y : 5 position.

    };

    $.extend(Tile.prototype, {
        isWall : function() { return this.code === '='; },

        isExit : function() { return this.code === 'e'; },

        isHouse : function() { return this.code === 'h'; },

        isOnlyLeft : function() { return this.code === '<'; },

        isOnlyRight : function() { return this.code === '>'; },

        isTunnel : function() { return this.code === 't'; },

        hasDot : function() { return this.item && this.code === '.'; },

        hasPill : function() { return this.item && this.code === '*'; },

        get : function(dir) {
            if (dir === 'u') return this.getU();
            if (dir === 'd') return this.getD();
            if (dir === 'l') return this.getL();
            if (dir === 'r') return this.getR();
            return null;
        },
        
        getU : function() {
            return this.map.getTile(this.col, this.row - 1) || null;
        },
        
        getD : function() {
            return this.map.getTile(this.col, this.row + 1) || null;
        },
        
        getL : function() {
            return this.map.getTile(this.col - 1, this.row) || null;
        },
        
        getR : function() {
            return this.map.getTile(this.col + 1, this.row) || null;
        }
    });
    
    return Tile;
    
});