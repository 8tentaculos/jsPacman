import $ from 'jquery';

class Tile {
    constructor(code, col, row, map)  {
        this.code = code;

        this.col = col;
        this.row = row;

        this.map = map;

        this.w = 16;
        this.h = 16;

        this.x = this.col * this.w + this.w / 2;

        this.y = this.row * this.h + this.h / 2 + 1; // Original Pacman has tile's center at x : 4, y : 5 position.
    }

    isWall() { return this.code === '='; }

    isHouse() { return this.code === 'h'; }

    isTunnel() { return this.code === 't'; }

    hasDot() { return this.item && this.code === '.'; }

    hasPill() { return this.item && this.code === '*'; }

    get(dir) {
        if (dir === 'u') return this.getU();
        if (dir === 'd') return this.getD();
        if (dir === 'l') return this.getL();
        if (dir === 'r') return this.getR();
        return null;
    }

    getU() {
        return this.map.getTile(this.col, this.row - 1) || null;
    }

    getD() {
        return this.map.getTile(this.col, this.row + 1) || null;
    }

    getL() {
        return this.map.getTile(this.col - 1, this.row) || null;
    }

    getR() {
        return this.map.getTile(this.col + 1, this.row) || null;
    }
}

export default Tile;
