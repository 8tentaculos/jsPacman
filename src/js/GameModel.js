import Model from './engine/Model';

import ts from './helper/ts';

import map1 from './maps/map-1';
import map2 from './maps/map-2';
import map3 from './maps/map-3';
import map4 from './maps/map-4';

// TODO: Add times data for each level.
const times = [
    { mode : 'scatter', time : 7 },
    { mode : 'chase', time : 20 },
    { mode : 'scatter', time : 7 },
    { mode : 'chase', time : 20 },
    { mode : 'scatter', time : 5 },
    { mode : 'chase', time : 20 },
    { mode : 'scatter', time : 5 },
    { mode : 'chase', time : 1000000 }
];

// This info was parsed from
// https://pacman.holenet.info/#LvlSpecs
var data = [
    [times, 0, "100", "80", "71", "75", "40", "20", "80", "10", "85", "90", "79", "50", "6", "5", map1, "maze-1"],
    [times, 1, "200", "90", "79", "85", "45", "30", "90", "15", "95", "95", "83", "55", "5", "5", map1, "maze-1"],
    [times, 2, "500", "90", "79", "85", "45", "40", "90", "20", "95", "95", "83", "55", "4", "5", map2, "maze-2"],
    [times, 3, "500", "90", "79", "85", "45", "40", "90", "20", "95", "95", "83", "55", "3", "5", map2, "maze-2"],
    [times, 4, "700", "100", "87", "95", "50", "40", "100", "20", "105", "100", "87", "60", "2", "5", map2, "maze-2"],
    [times, 5, "700", "100", "87", "95", "50", "50", "100", "25", "105", "100", "87", "60", "5", "5", map3, "maze-3"],
    [times, 6, "1000", "100", "87", "95", "50", "50", "100", "25", "105", "100", "87", "60", "2", "5", map3, "maze-3"],
    [times, 7, "1000", "100", "87", "95", "50", "50", "100", "25", "105", "100", "87", "60", "2", "5", map3, "maze-3"],
    [times, 0, "2000", "100", "87", "95", "50", "60", "100", "30", "105", "100", "87", "60", "1", "3", map3, "maze-3"],
    [times, 1, "2000", "100", "87", "95", "50", "60", "100", "30", "105", "100", "87", "60", "5", "5", map4, "maze-4"],
    [times, 2, "2000", "100", "87", "95", "50", "60", "100", "30", "105", "100", "87", "60", "2", "5", map4, "maze-4"],
    [times, 3, "2000", "100", "87", "95", "50", "80", "100", "40", "105", "100", "87", "60", "1", "3", map4, "maze-4"],
    [times, 4, "5000", "100", "87", "95", "50", "80", "100", "40", "105", "100", "87", "60", "1", "3", map4, "maze-4"],
    [times, 5, "5000", "100", "87", "95", "50", "80", "100", "40", "105", "100", "87", "60", "3", "5", map3, "maze-3"],
    [times, 6, "5000", "100", "87", "95", "50", "100", "100", "50", "105", "100", "87", "60", "1", "3", map3, "maze-3"],
    [times, 7, "5000", "100", "87", "95", "50", "100", "100", "50", "105", "100", "87", "60", "1", "3", map3, "maze-3"],
    [times, 7, "5000", "100", "87", "95", "50", "100", "100", "50", "105", "0", "0", "0", "0", "0", map3, "maze-3"],
    [times, 7, "5000", "100", "87", "95", "50", "100", "100", "50", "105", "100", "87", "60", "1", "3", map4, "maze-4"],
    [times, 7, "5000", "100", "87", "95", "50", "120", "100", "60", "105", "0", "0", "0", "0", "0", map4, "maze-4"],
    [times, 7, "5000", "100", "87", "95", "50", "120", "100", "60", "105", "0", "0", "0", "0", "0", map4, "maze-4"],
    [times, 7, "5000", "90", "79", "95", "50", "120", "100", "60", "105", "0", "0", "0", "0", "0", map4, "maze-4"]
];

var keys = [
    'game.times',
    'game.bonusIndex',
    'game.bonusScore',
    'pacman.speed',
    'pacman.dotSpeed',
    'ghost.speed',
    'ghost.tunnelSpeed',
    '',
    '',
    '',
    '',
    'pacman.frightenedSpeed',
    'pacman.frightenedDotSpeed',
    'ghost.frightenedSpeed',
    'ghost.frightenedTime',
    'ghost.frightenedFlashes',
    'game.map',
    'game.maze'
];

class GameModel extends Model {
    constructor(attrs) {
        super({
            level : 1,
            score : 0,
            highScore : 0,
            lives : 3,
            extraLives : 1,
            extraLifeScore : 10000,
            mode : null,
            ...attrs
        });

        this.url = 'jsPacman';

        this.on('change:score', this.onChangeScore.bind(this));
    }

    addScore(score) {
        this.score = this.score + score;
    }

    updateMode() {
        if (!this.mode) this.modeTime = ts();

        const { times } = this.getSettings('game');

        let now = ts(),
            total = 0,
            i = 0;

        while(times[i]) {
            total += times[i].time;
            if (total + this.modeTime > now || i === times.length - 1) {
                this.mode = times[i].mode;
                break;
            }
            i++;
        }
    }

    pause() {
        this.pauseTime = ts();
    }

    resume() {
         this.modeTime = ts() - this.pauseTime;
    }

    getSettings(key) {
        const obj = {};

        const level = this.level > data.length ? data.length : this.level;

        let i = keys.length;

        while(i--) {
            let parts = keys[i].split('.');
            if (parts[0] === key) obj[parts[1]] = data[level - 1][i];
        }

        return obj;
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
