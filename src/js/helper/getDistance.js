/**
 * Distance between two tiles.
 * @param {Tile} tileA - The first tile.
 * @param {Tile} tileB - The second tile.
 * @returns {number} The distance between the two tiles.
 */
const getDistance = (tileA, tileB) => {
    const x = tileA.x, x1 = tileB.x, y = tileA.y, y1 = tileB.y;
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
};

export default getDistance;
