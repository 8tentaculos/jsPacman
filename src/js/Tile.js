/**
 * Tile class representing a single tile in the game map.
 * @class Tile
 */
class Tile {
    /**
     * Creates an instance of Tile.
     * @param {string} code - The tile code character ('=', 'h', 't', '.', '*', etc.).
     * @param {number} col - Column index in the map.
     * @param {number} row - Row index in the map.
     * @param {Map} map - Reference to the parent map.
     */
    constructor(code, col, row, map)  {
        this.code = code;

        this.col = col;
        this.row = row;

        this.map = map;

        this.width = 32;
        this.height = 32;

        this.x = this.col * this.width + this.width / 2;

        this.y = this.row * this.height + this.height / 2 + 4; // Original Pacman has tile's center at x : 4, y : 5 position.
    }

    /**
     * Checks if this tile is a wall.
     * @returns {boolean} True if the tile is a wall.
     */
    isWall() { return this.code === '='; }

    /**
     * Checks if this tile is part of the ghost house.
     * @returns {boolean} True if the tile is in the ghost house.
     */
    isHouse() { return this.code === 'h'; }

    /**
     * Checks if this tile is a tunnel.
     * @returns {boolean} True if the tile is a tunnel.
     */
    isTunnel() { return this.code === 't'; }

    /**
     * Checks if this tile has a dot item.
     * @returns {boolean} True if the tile has a dot.
     */
    hasDot() { return this.item && this.code === '.'; }

    /**
     * Checks if this tile has a power pill item.
     * @returns {boolean} True if the tile has a power pill.
     */
    hasPill() { return this.item && this.code === '*'; }

    /**
     * Gets the adjacent tile in the specified direction.
     * @param {string} dir - Direction ('u', 'd', 'l', 'r').
     * @returns {Tile|null} The adjacent tile or null.
     */
    get(dir) {
        if (dir === 'u') return this.getU();
        if (dir === 'd') return this.getD();
        if (dir === 'l') return this.getL();
        if (dir === 'r') return this.getR();
        return null;
    }

    /**
     * Gets the tile above this one.
     * @returns {Tile|null} The tile above or null.
     */
    getU() {
        return this.map.getTile(this.col, this.row - 1) || null;
    }

    /**
     * Gets the tile below this one.
     * @returns {Tile|null} The tile below or null.
     */
    getD() {
        return this.map.getTile(this.col, this.row + 1) || null;
    }

    /**
     * Gets the tile to the left of this one.
     * @returns {Tile|null} The tile to the left or null.
     */
    getL() {
        return this.map.getTile(this.col - 1, this.row) || null;
    }

    /**
     * Gets the tile to the right of this one.
     * @returns {Tile|null} The tile to the right or null.
     */
    getR() {
        return this.map.getTile(this.col + 1, this.row) || null;
    }
}

export default Tile;
