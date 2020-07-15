import $ from 'jquery';
import Helper from './Helper';
import makeMsPacman from './factory/makeMsPacman';

class Lives {
    constructor(attrs) {
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
                defaultAnimation : 'right'
            }));

            if (i > this.lives - 2) this.pacmans[i].el.hide();
        }

        this.el = this.pacmans[0].el;
    }

    die() {
        this.lives--;
        if (this.lives) this.render();
        else this.trigger('lives:gameover');
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
            if (i > this.lives - 2) this.pacmans[i].el.hide();
            else this.pacmans[i].el.show();
        }
    }
}

Object.assign(Lives.prototype, Helper);

export default Lives;
