
define(['jquery', 'Ghost'], function($, Ghost) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = { id : 'bot-pinky' };
            // Pink Ghost
            if (attrs.id === 'bot-pinky') {
                attrs = $.extend({
                    dir : 'd',
                    defaultAnimation : 'down',
                    getChaseTarget : function() {
                        var t = this.pacman.getTile();
                        var dir = this.pacman.dir;
                        return t.get(dir).get(dir).get(dir).get(dir);
                    },
                    animations : {
                        right : {
                            offsety : 126,
                            offsetx : -1
                        },
                    
                        down : {
                            offsety : 126,
                            offsetx : 32 * 2 - 1
                        },
                    
                        up : {
                            offsety : 126,
                            offsetx : 32 * 4 - 1
                        },
                    
                        left : {
                            offsety : 126,
                            offsetx : 32 * 6 - 1
                        }
                    }
                }, attrs);
            }
            // Red Ghost
            if (attrs.id === 'bot-blinky') {
                attrs = $.extend({
                    dir : 'l',
                    waitTime : 0,
                    scatterTarget : 25,
                    defaultAnimation : 'left',
                    animations : {        
                        right : {
                            offsety : 62,
                            offsetx : -1
                        },
                    
                        down : {
                            offsety : 62,
                            offsetx : 32 * 2 - 1
                        },
                    
                        up : {
                            offsety : 62,
                            offsetx : 32 * 4 - 1
                        },
                    
                        left : {
                            offsety : 62,
                            offsetx : 32 * 6 - 1
                        }
                    }
                }, attrs);
            }
            // Cyan Ghost
            if (attrs.id === 'bot-inky') {
                attrs = $.extend({
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
                            offsety : 158,
                            offsetx : -1
                        },
            
                        down : {
                            offsety : 158,
                            offsetx : 32 * 2 - 1
                        },
                
                        up : {
                            offsety : 158,
                            offsetx : 32 * 4 - 1
                        },
                
                        left : {
                            offsety : 158,
                            offsetx : 32 * 6 - 1
                        }
                    }

                }, attrs);
            }

            // Orange Ghost
            if (attrs.id === 'bot-sue') {
                attrs = $.extend({
                    dir : 'u',
                    waitTime : 8,
                    scatterTarget : 953,
                    defaultAnimation : 'up',
                    getChaseTarget : function() {
                        var t = this.pacman.getTile();
                        var d = this.getDistance(t, this.getTile());
                        if (d > 8 * t.w) return t;
                        else return this.scatterTarget;
                    },
                    animations : {
                        right : {
                            offsety : 94,
                            offsetx : -1
                        },

                        down : {
                            offsety : 94,
                            offsetx : 32 * 2 - 1
                        },
                    
                        up : {
                            offsety : 94,
                            offsetx : 32 * 4 - 1
                        },
                    
                        left : {
                            offsety : 94,
                            offsetx : 32 * 6 - 1
                        }
                   }

                }, attrs);
            }

            return new Ghost(attrs);

        }
    };
});

