
define(['jquery', 'Bonus'], function($, Bonus) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = { id : 'bot-bonus-1' };
            // Pink Ghost
            if (attrs.id === 'bot-bonus-1') {
                attrs = $.extend({
                    dir : 'r',
                    animations : {
                    }
                }, attrs);
            }
            
            return new Bonus(attrs);

        }
    };
});

