import { Model } from 'rasti';

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
    }

    addScore(score) {
        this.score = this.score + score;

        if (this.extraLife && this.score >= this.extraLifeScore) {
            this.extraLife--;
            this.lives++;
        }

        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
    }
}

export default GameModel;
