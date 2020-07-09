import $ from 'jquery';
import Helper from './Helper';

class Item {
    constructor(attrs = {}) {
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
        // Cache jQuery el.
        this.el = $('#' + this.id);
    }

    render() {
        this.animation = this.animations[this.defaultAnimation];

        this.pg.addSprite(this.id, {
            animation : this.animation,
            posx: this.x - this.hw,
            posy: this.y - this.hh,
            width: this.w,
            height: this.h
        });

        this._lastX = this.x;
        this._lastY = this.y;
        this._lastAnimation = this.animation;
    }

    destroy() {
        this.el.remove();
    }

    getTile() {
        return this.map.getTile(this.x, this.y, true);
    }
}

Object.assign(Item.prototype, Helper, {
    // Options.
    w : null,
    h : null,
    x : null,
    y : null,
    // Playground and map.
    pg : null,
    map : null,
    // Animations.
    animations : null,
    defaultAnimation : 'default'
});

export default Item;
