// Orange Ghost
Game.makeSue = function(attrs) {
    if (!attrs) attrs = {};

    return new Game.Ghost($.extend({
        id : 'bot-sue',
        dir : 'R',
        pipe : 'pipe_224_278_248_278',
        position : 24,
        skill : 8,
        waitTime : 6,
        defaultAnimation : 'right',
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
    }, attrs));
};

