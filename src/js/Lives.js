import $ from 'jquery';
import { Emitter } from 'rasti';
import makeMsPacman from './factory/makeMsPacman';

class Lives extends Emitter {
    constructor(options) {
        super();

        this.pacmans = [];

        this.pg = options.pg;
        this.model = options.model;

        for (var i = 0; i < 5; i++) {
            this.pacmans.push(makeMsPacman({
                id : 'live-' + i,
                pg : options.pg,
                scaling : options.scaling,
                x : options.x + i * 70,
                y : options.y,
                defaultAnimation : 'right',
                addGameGhostEatEventListener : () => {},
                addGameGhostModeFrightenedEnter : () => {},
                addGameGhostModeFrightenedExit : () => {}
            }));

            if (i > this.model.lives - 2) this.pacmans[i].hide();
        }

        this.model.on('change:lives', this.render.bind(this));
    }

    render() {
        for (var i = 0; i < 5; i++) {
            if (i > this.model.lives - 2) this.pacmans[i].hide();
            else this.pacmans[i].show();
        }
    }
}

export default Lives;
