define(['jquery', 'Item'], function($, Item) {
    return {
        make : function(attrs) {
            if (!attrs) attrs = {};

            return new Item($.extend({
                w : 4,
                h : 4,
                animations : {
                    default : {
                        imageURL : 'img/pills.png',
                        numberOfFrame : 1,
                        offsetx : 12
                    }
                }
            }, attrs));
        }
    };
});