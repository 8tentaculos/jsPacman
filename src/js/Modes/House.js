import Character from '../Character';
import Mode from './Mode';
import ts from '../helper/ts';

class House extends Mode {
    constructor(ghost) {
        super(ghost);

        this._houseTop = this.ghost.y - this.ghost.getTile().height / 2;
        this._houseBottom = this.ghost.y + this.ghost.getTile().height / 2;
        this._exitTile = this.ghost.map.house.getR();
        this._exitTileX = this._exitTile.x  - this.ghost.map.tileWidth / 2;
    }

    onEnter() {
        this._prepareExit = false;
        this.ghost._speed = 70;
    }

    resume() {
        if (!this._prepareExit) this._startTime += ts() - this._pauseTime;
    }

    getNextDirection() {}

    move() {
        if (!this._startTime) this._startTime = ts();

        var tile = this.ghost.getTile();

        if (!this._prepareExit && ts() - this._startTime > this.ghost.waitTime && !tile.isWall()) {
            this._prepareExit = true;
            this.ghost.y = tile.y;
        }

        if (this.exit()) {

            this.onExit();

        } else if (this._prepareExit) {
            if (this.ghost.x < this._exitTileX) this.ghost.dir = 'r';
            else if (this.ghost.x > this._exitTileX) this.ghost.dir = 'l';
            else this.ghost.dir = 'u';

            if (this.ghost.dir === 'u')
                this.ghost.y -= this.ghost.getMin(this.ghost.getStep(), this.ghost.y - this._exitTile.getU().y);
            if (this.ghost.dir === 'r')
                this.ghost.x += this.ghost.getMin(this.ghost.getStep(), this._exitTileX - this.ghost.x);
            if (this.ghost.dir === 'l')
                this.ghost.x -= this.ghost.getMin(this.ghost.getStep(), this.ghost.x - this._exitTileX);

            this.setAnimation();

            this.ghost.update();

        } else {

            if (this.ghost.y <= this._houseTop && this.ghost.dir === 'u') this.ghost.dir = 'd';
            if (this.ghost.y >= this._houseBottom && this.ghost.dir === 'd') this.ghost.dir = 'u';

            if (this.ghost.dir === 'u')
                this.ghost.y -= this.ghost.getMin(this.ghost.getStep(), this.ghost.y - this._houseTop);
            if (this.ghost.dir === 'd')
                this.ghost.y += this.ghost.getMin(this.ghost.getStep(), this._houseBottom - this.ghost.y);

            this.setAnimation();

            this.ghost.update();
        }
    }

    setAnimation() {
        if (this.ghost.frightened) this.ghost.frightened.setAnimation();
        else Character.prototype._setNextAnimation.call(this.ghost);
    }

    exit() {
        if (this.ghost.frightened && this.ghost.frightened.exit()) {
            this.ghost.frightened = null;
        }

        return this.ghost.getTile() === this._exitTile.getU();
    }

    onExit() {
        this._startTime = null;

        var tile = this.ghost.getTile();

        this.ghost._dir = 'l';
        this.ghost._nextDir = 'l';
        this.ghost._lastTile = tile.getD();
        this.ghost._speed = this.ghost.speed;
        this.ghost.setMode();
    }
}

export default House;
