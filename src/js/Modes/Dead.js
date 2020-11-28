import Character from '../Character';
import Mode from './Mode';

class Dead extends Mode {
    constructor(ghost) {
        super(ghost);

        this._target = this.ghost.map.house.getR().getU();

        this._endX = this.ghost._defaults.x;
        this._endY = this.ghost.map.houseCenter.y;

        this._end = this.ghost.map.getTile(this._endX, this._endY, true);
    }

    onEnter() {
        this._prepareEnter = false;
        this.ghost._nextAnimation =  this.ghost.animations[`score${this.ghost.score}`];
        this.ghost.update();
    }

    move() {
        if (!this._prepareEnter && this.ghost.getTile() === this._target) {
            this._prepareEnter = true;
        }

        if (this.exit()) {

            this.onExit();

        } else if (this._prepareEnter) {
            var endX = this._endX;
            var endY = this._endY;
            // Should go to center first
            if (this.ghost.y < endY) endX = this._target.x - this.ghost.map.tw / 2;
            // Set direction
            if (this.ghost.x < endX) this.ghost.dir = 'r';
            else if (this.ghost.x > endX) this.ghost.dir = 'l';
            else if (this.ghost.y < endY) this.ghost.dir = 'd';
            // Move
            if (this.ghost.dir === 'd')
                this.ghost.y += this.ghost.getMin(this.ghost.getStep(), endY - this.ghost.y);
            if (this.ghost.dir === 'r')
                this.ghost.x += this.ghost.getMin(this.ghost.getStep(), endX - this.ghost.x);
            if (this.ghost.dir === 'l')
                this.ghost.x -= this.ghost.getMin(this.ghost.getStep(), this.ghost.x - endX);

            this.setAnimation();

            this.ghost.update();

        } else {

            Character.prototype.move.call(this.ghost, this.ghost._dir);

        }
    }

    setAnimation() {
        if (this.ghost.dir === 'u') {
            this.ghost._nextAnimation = this.ghost.animations.deadUp;
        }
        if (this.ghost.dir === 'r') {
            this.ghost._nextAnimation = this.ghost.animations.deadRight;
        }
        if (this.ghost.dir === 'd') {
            this.ghost._nextAnimation = this.ghost.animations.deadDown;
        }
        if (this.ghost.dir === 'l') {
            this.ghost._nextAnimation = this.ghost.animations.deadLeft;
        }
    }

    _getTarget() {
        return this._target;
    }

    canGo(dir, tile) {
        if (!tile) tile = this.ghost.getTile();

        var nextTile = tile.get(dir);

        return !nextTile || !nextTile.isWall();
    }

    exit() {
        return this.ghost.getTile() === this._end;
    }

    onExit() {
        // var attrs = this.ghost.id === 'bot-blinky' ? {x : this.ghost.x, y : this.ghost.y} : {};
        this.ghost.reset();
    }
}

export default Dead;
