// Mixin with some useful methods.
define([], function() {
    return {
        // Return time stamp in seconds.
        ts : function() {
            return (new Date().getTime()) / 1000;
        },
        // Return random number between 0 and total less one.
        rnd : function(total) {
            return Math.floor((Math.random() * total));
        },
        getDistance : function(tileA, tileB) {
            var x = tileA.x, x1 = tileB.x, y = tileA.y, y1 = tileB.y;

            return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        },
        // Bind/unbind and trigger events throw this.el
        trigger : function(ev, params) {
            this.el.trigger(ev, params);
        },

        on : function(ev, handler) {
            this.el.on(ev, handler);
        },

        off : function(ev, handler) {
            this.el.off(ev, handler);
        },

        $ : function(selector) {
          return this.el.find(selector);
        }
    };
});