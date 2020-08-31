import { Model } from 'rasti';

class GameModel extends Model {
    constructor(attrs) {
        super({
            level : 1,
            score : 0,
            highScore : 0,
            lives : 3,
            extraLives : 1,
            extraLifeScore : 2000,
            ...attrs
        });
    }

    addScore(score) {
        this.score = this.score + score;

        if (this.extraLives && this.score >= this.extraLifeScore) {
            this.extraLives--;
            this.lives++;
        }

        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
    }
}

export default GameModel;
