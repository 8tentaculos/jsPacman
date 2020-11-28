import makeBonus from './factory/makeBonus';

class Bonuses {
    constructor(options) {
        this.bonuses = [];

        this.x = options.x;
        this.y = options.y;

        this.model = options.model;

        for (var i = 0; i < 8; i++) {
            let bonus = makeBonus(i, {
                x : options.x - i * 64,
                y : options.y,
                factor : options.factor,
                addPacmanPositionEventListener : () => {},
                normalizeRefrashRate : () => 1
            });

            options.addSprite(bonus);
            this.bonuses.push(bonus);

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
