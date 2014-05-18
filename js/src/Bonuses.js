define(['jquery', 'Factory/Bonus'], function($, FactoryBonus) {
    var Bonuses = function(options) {

        this.bonuses = [];
        this.pg = options.pg;

        this.x = options.x;
        this.y = options.y;

        this.level = options.level;

        for (var i = 0; i < 8; i++) {
            this.bonuses.push(FactoryBonus.make({
                id : 'bonuses-' + i,
                pg : options.pg,
                x : options.x - i * 32,
                y : options.y
            }, i));

            if (i >= this.level) this.bonuses[i].el.hide();
        }
    };

    Bonuses.prototype.setLevel = function(level) {
        this.level = level > 8 ? 8 : level;
        this.render();
    };

    Bonuses.prototype.render = function() {
        for (var i = 0; i < 8; i++) {
            if (i >= this.level) this.bonuses[i].el.hide();
            else this.bonuses[i].el.show();
        }
    };

    return Bonuses;
});