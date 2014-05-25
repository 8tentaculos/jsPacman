define(['jquery', 'Item'], function($, Item) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = {};

            return new Item($.extend({
                w : 4,
                h : 4,

                aniBase  : {
                    imageURL : 'img/pills.png',
                    numberOfFrame : 1
                },
                
                defaultAnimation : 'white',
                
                animations : {
                    white : {
                        offsetx : 12
                    },
                    yellow : {
                        offsetx : 12 + 16
                    },
                    red : {
                        offsetx : 12 + 16 * 2
                    }
                }
            }, attrs));
        }
    };
});