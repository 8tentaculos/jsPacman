
define(['jquery', 'Item', 'gameQuery'], function($, Item) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = {};

            return new Item($.extend({
                w : 12,
                h : 12,
                aniBase : {
                    imageURL : 'img/pills.png',
                    numberOfFrame : 2,
                    delta : 12, 
                    rate : 450,
                    type : $.gQ.ANIMATION_VERTICAL
                },

                defaultAnimation : 'white',

                animations : {
                    white : {},
                    yellow : {
                        offsetx : 12 + 4
                    },
                    red : {
                        offsetx : (12 + 4) * 2
                    }
                }

            }, attrs));
        }
    };
});
