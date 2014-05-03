define(['jquery', 'Helper', 'Factory/MsPacman'], function($, Helper, FactoryMsPacman) {
    var Lives = function(options) {

        this.pacmans = [];
        this.lives = options.lives;
        this.pg = options.pg;

        for (var i = 0; i < 5; i++) {
            this.pacmans.push(FactoryMsPacman.make({
                id : 'live-' + i,
                pg : options.pg,
                x : options.x + i * 35,
                y : options.y,
                defaultAnimation : 'right'
            }));

            if (i > this.lives - 2) this.pacmans[i].el.hide();
        }

        this.el = this.pacmans[0].el;
    };

    $.extend(Lives.prototype, Helper);

    Lives.prototype.die = function() {
        this.lives--;
        if (this.lives) this.render();
        else this.trigger('lives:gameover');
    };

    Lives.prototype.add = function() {
        this.lives++;
        this.render();
    };

    Lives.prototype.set = function(lives) {
        this.lives = lives;
        this.render();
    };

    Lives.prototype.render = function() {
        for (var i = 0; i < 5; i++) {
            if (i > this.lives - 2) this.pacmans[i].el.hide();
            else this.pacmans[i].el.show();
        }
    };

    return Lives;
});