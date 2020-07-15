import $ from 'jquery';
import { Emitter } from 'rasti';
import makeMsPacman from './factory/makeMsPacman';

class Lives extends Emitter {
    constructor(attrs) {
        super();

        this.pacmans = [];
        this.lives = attrs.lives;
        this.pg = attrs.pg;

        for (var i = 0; i < 5; i++) {
            this.pacmans.push(makeMsPacman({
                id : 'live-' + i,
                pg : attrs.pg,
                scaling : attrs.scaling,
                x : attrs.x + i * 70,
                y : attrs.y,
                defaultAnimation : 'right',
                addGameGhostEatEventListener : () => {},
                addGameGhostModeFrightenedEnter : () => {},
                addGameGhostModeFrightenedExit : () => {}
            }));

            if (i > this.lives - 2) this.pacmans[i].hide();
        }

        this.$el = this.pacmans[0].$el;
    }

    die() {
        this.lives--;
        if (this.lives) this.render();
        else this.emit('lives:gameover');
    }

    add() {
        this.lives++;
        this.render();
    }

    set(lives) {
        this.lives = lives;
        this.render();
    }

    render() {
        for (var i = 0; i < 5; i++) {
            if (i > this.lives - 2) this.pacmans[i].hide();
            else this.pacmans[i].show();
        }
    }
}

export default Lives;
