import Pacman from './Pacman';

class Lives  {
    constructor(options) {
        this.pacmans = [];

        this.model = options.model;

        for (var i = 0; i < 5; i++) {
            let pacman = new Pacman({
                x : options.x + i * 70,
                y : options.y,
                factor : options.factor,
                defaultAnimation : 'right',
                addGameGhostEatEventListener : () => {},
                addGameGhostModeFrightenedEnter : () => {},
                addGameGhostModeFrightenedExit : () => {},
                normalizeRefrashRate : () => 1
            });

            options.addSprite(pacman);
            this.pacmans.push(pacman);

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
