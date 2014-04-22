define(['jquery', 'Helper'], function($, Helper) {
    var Item = function(attrs) {
        if (!attrs) attrs = {};
        // Deeply override of animations.
        if (attrs.animations || this.animations) {
            this.animations = $.extend((this.animations || {}), (attrs.animations || {}));
            delete attrs.animations;
        }
        // Extend this with attrs.
        $.extend(this, attrs);

        if (this.animation || this.animations) {
            this.hw = parseInt(this.w / 2);
            this.hh = parseInt(this.h / 2);

            // this.animations may be a function returning animations object.
            if (this.animations) {
                for (var key in this.animations) {
                    if (this.aniBase) 
                        this.animations[key] = $.extend({}, this.aniBase, this.animations[key]);
                        
                    this.animations[key] = new $.gQ.Animation(this.animations[key]);
                }
            }

            this.render();
            // Cache jQuery el.
            this.el = $('#' + this.id);
        }
    }; 
 
    $.extend(Item.prototype, Helper, { 
        // Options.
        w : null,
        h : null,

        x : null,
        y : null,
        // End Options.
        pg : null,
        map : null,
        
        animations : null,

        render : function() {
            this.animation = this.animations.default || this.animations[this.defaultAnimation];

            this.pg.addSprite(this.id, {
                animation : this.animation,
                posx: this.x - this.hw, 
                posy: this.y - this.hh, 
                width: this.w,
                height: this.h
            });
            
            this._lastX = this.x;
            this._lastY = this.y;
            this._lastAni = this.animation; 
        },
        
        destroy : function() {
            this.el.remove();
        },
        
        getTile : function() {
            return this.map.getTile(this.x, this.y, true);
        }
    });
    
    return Item;

});