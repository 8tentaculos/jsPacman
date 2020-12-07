import Model from './engine/Model';

class GameModel extends Model {
    constructor(attrs) {
        super({
            level : 1,
            score : 0,
            highScore : 0,
            lives : 3,
            extraLives : 1,
            extraLifeScore : 10000,
            ...attrs
        });

        this.url = 'jsPacman';

        this.on('change:score', this.onChangeScore.bind(this));
    }

    addScore(score) {
        this.score = this.score + score;
    }

    onChangeScore() {
        if (this.extraLives && this.score >= this.extraLifeScore) {
            this.extraLives--;
            this.lives++;
        }

        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
    }

    toJSON() {
        return { highScore : this.highScore };
    }
}

export default GameModel;
