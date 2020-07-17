import $ from 'jquery';
import { Emitter } from 'rasti';

class Item extends Emitter {
    constructor(attrs = {}) {
        super();

        const { animations, ...rest } = attrs;
        // Extend this with attrs.
        Object.assign(this, rest);
        // Half width and half height.
        this.hw = parseInt(this.w / 2);
        this.hh = parseInt(this.h / 2);
        // Merge animations options objects.
        this.animations = { ...this.animations, ...animations };
        // Create animations.
        Object.keys(this.animations).forEach(key => {
            this.animations[key] = new $.gQ.Animation({
                ...this.animationBase,
                ...this.animations[key]
            });
        });
        // Render.
        this.render();
        // Cache el.
        this.el = document.querySelector(`#${this.id}`);
        // Cache jQuery el.
        this.$el = $(this.el);
        // Scale sprite.
        this.$el.scale(this.scaling.getScale());
    }

    render() {
        this.animation = this.animations[this.defaultAnimation];

        this.pg.addSprite(this.id, {
            animation : this.animation,
            posx : this.scaling.getX(this.x) - this.hw,
            posy : this.scaling.getY(this.y) - this.hh,
            width : this.w,
            height : this.h
        });

        this._lastX = this.x;
        this._lastY = this.y;
        this._lastAnimation = this.animation;
    }

    destroy() {
        this.$el.remove();
        this.off();
    }

    getTile() {
        return this.map.getTile(this.x, this.y, true);
    }

    hide() {
        this.el.style.display = 'none';
    }

    show() {
        this.el.style.display = '';
    }
}

Object.assign(Item.prototype, {
    // Options.
    w : null,
    h : null,
    x : null,
    y : null,
    // Playground, scaling and map.
    pg : null,
    scaling : null,
    map : null,
    // Animations.
    animations : null,
    defaultAnimation : 'default'
});

export default Item;
