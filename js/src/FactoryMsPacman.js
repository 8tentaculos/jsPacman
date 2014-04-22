define(['jquery', 'Pacman'], function($, Pacman) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = {};

            return new Pacman($.extend({
                id : 'bot-ms-pacman', 
                preturn : true,
                x : 226,
                y : 424
            }, attrs));
        }
    };
});
 