import $ from 'jquery';
import makeBonus from './factory/makeBonus';

class Bonuses {
    constructor(options) {
        this.bonuses = [];
        this.pg = options.pg;

        this.x = options.x;
        this.y = options.y;

        this.model = options.model;

        for (var i = 0; i < 8; i++) {
            this.bonuses.push(makeBonus({
                id : 'bonuses-' + i,
                pg : options.pg,
                scaling : options.scaling,
                x : options.x - i * 64,
                y : options.y,
                addPacmanPositionEventListener : () => {}
            }, i));

            if (i >= this.model.level) this.bonuses[i].hide();
        }

        this.model.on('change:level', this.render.bind(this));
    }

    render() {
        for (var i = 0; i < 8; i++) {
            if (i >= this.model.level) this.bonuses[i].hide();
            else this.bonuses[i].show();
        }
    }
}

export default Bonuses;
