import $ from 'jquery';
import makeBonus from './factory/makeBonus';

class Bonuses {
    constructor(attrs) {
        this.bonuses = [];
        this.pg = attrs.pg;

        this.x = attrs.x;
        this.y = attrs.y;

        this.level = attrs.level;

        for (var i = 0; i < 8; i++) {
            this.bonuses.push(makeBonus({
                id : 'bonuses-' + i,
                pg : attrs.pg,
                scaling : attrs.scaling,
                x : attrs.x - i * 64,
                y : attrs.y
            }, i));

            if (i >= this.level) this.bonuses[i].$el.hide();
        }
    }

    setLevel(level) {
        this.level = level > 8 ? 8 : level;
        this.render();
    }

    render() {
        for (var i = 0; i < 8; i++) {
            if (i >= this.level) this.bonuses[i].$el.hide();
            else this.bonuses[i].$el.show();
        }
    }
}

export default Bonuses;
