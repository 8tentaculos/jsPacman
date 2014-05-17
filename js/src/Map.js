define(['jquery', 'Tile'], function($, Tile) {

    var Map = function(data) {
        /*
        data = ['----------------------------',
                '============================',
                '=......==..........==......=',
                '=*====.==.========.==.====*=']
        */
        // Store tiles in array.
        this.tiles = [];
        // Set with and height according to data.
        this.w = data[0].length;
        this.h = data.length;

        this.tunnels = [];

        // Instantiate tiles and store them.
        for (var y = 0; y < this.h; y++) {
            var r = data[y];
            for (var x = 0; x < this.w; x++) {
                var code = r.charAt(x);
                var t = new Tile(code, x, y, this);
                this.tiles.push(t);
                if (t.isHouse() && !this.house) { // Store left house door
                    this.house = t;
                }
                if (t.isTunnel() && (t.col === 0 || t.col === this.w - 1)) {
                    this.tunnels.push(t);
                }
            }
        }

        this.houseCenter = this.house.getD().getD();

        // Cache tile dimensions
        this.tw = this.tiles[0].w;
        this.th = this.tiles[0].h;
    };

    $.extend(Map.prototype, {
        // Return tile object. 
        getTile : function(col, row, inPixels) {
            if (inPixels) {    
                col = parseInt(col / this.tw);
                row = parseInt(row / this.th); 
            }

            if (col > this.w - 1) col = 0;
            if (col < 0) col = this.w - 1;
            if (row > this.h - 1) row = 0;
            if (row < 0) row = this.h - 1;

            var idx = (row * this.w) + col;

            return this.tiles[idx] || null;
        },

        destroyItems : function() {
            var i = this.tiles.length;
            while (i--) {
                var t = this.tiles[i];
                if (t.item) t.item.destroy();
            }
        },

        hideItems : function() {
            var i = this.tiles.length;
            while (i--) {
                var t = this.tiles[i];
                if (t.item) t.item.el.hide();
            }
        }
       
    });
    
    return Map;
    
});
