// Distance between two tiles.
export default (tileA, tileB) => {
    const x = tileA.x, x1 = tileB.x, y = tileA.y, y1 = tileB.y;
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
}
