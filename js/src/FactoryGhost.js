
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
                            offsety : 126
                        },
                    
                        down : {
                            offsety : 126,
                            offsetx : 32 * 2
                        },
                    
                        up : {
                            offsety : 126,
                             offsetx : 32 * 4
                        },
                    
                        left : {
                            offsety : 126,
                            offsetx : 32 * 6
                        }
                    }
                }, attrs);
            }
            // Red Ghost
            if (attrs.id === 'bot-blinky') {
                attrs = $.extend({
                    dir : 'l',
                    lastEatTimeLimit : 0,
                    scatterTarget : 25,
                    defaultAnimation : 'left',
                    animations : {        
                        right : {
                            offsety : 62
                        },
                    
                        down : {
                            offsety : 62,
                            offsetx : 32 * 2
                        },
                    
                        up : {
                            offsety : 62,
                            offsetx : 32 * 4
                        },
                    
                        left : {
                            offsety : 62,
                            offsetx : 32 * 6
                        }
                    }
                }, attrs);
            }


            // Cyan Ghost
            if (attrs.id === 'bot-inky') {
                attrs = $.extend({
                    dir : 'u',
                    lastEatTimeLimit : 6,
                    scatterTarget : 979,
                    defaultAnimation : 'up',
                    animations : {        
                        right : {
                            offsety : 158
                        },
            
                        down : {
                            offsety : 158,
                            offsetx : 32 * 2
                        },
                
                        up : {
                            offsety : 158,
                            offsetx : 32 * 4
                        },
                
                        left : {
                            offsety : 158,
                            offsetx : 32 * 6
                        }
                    }

                }, attrs);
            }

            // Orange Ghost
            if (attrs.id === 'bot-sue') {
                attrs = $.extend({
                    dir : 'u',
                    lastEatTimeLimit : 8,
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
                            offsety : 94
                        },

                        down : {
                            offsety : 94,
                            offsetx : 32 * 2
                        },
                    
                        up : {
                            offsety : 94,
                            offsetx : 32 * 4
                        },
                    
                        left : {
                            offsety : 94,
                            offsetx : 32 * 6
                        }
                   }

                }, attrs);
            }

            return new Ghost(attrs);

        }
    };
});

