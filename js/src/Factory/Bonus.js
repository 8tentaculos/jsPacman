
define(['jquery', 'Bonus'], function($, Bonus) {
    return {
        make : function(attrs, idx) {
            
            if (attrs.id === 'bot-bonus-1') idx = 0;
            if (attrs.id === 'bot-bonus-2') idx = 1;
            if (attrs.id === 'bot-bonus-3') idx = 2;
            if (attrs.id === 'bot-bonus-4') idx = 3;
            if (attrs.id === 'bot-bonus-5') idx = 4;
            if (attrs.id === 'bot-bonus-6') idx = 5;
            if (attrs.id === 'bot-bonus-7') idx = 6;
            if (attrs.id === 'bot-bonus-8') idx = 7;

            attrs = $.extend({
                animations : {
                    default : {
                        offsetx : 30 * idx
                    }
                }
            }, attrs);
            
            return new Bonus(attrs);

        }
    };
});

