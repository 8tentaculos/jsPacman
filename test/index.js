import { expect } from 'chai';
import Animation from '../src/js/engine/Animation.js';
import Map from '../src/js/Map.js';
import map1 from '../src/js/maps/map-1.js';
import Item from '../src/js/Item.js';
import makeMsPacman from '../src/js/factory/makeMsPacman.js';

let map;

document.body.innerHTML = '<div id="playground"></div>';

describe('Map', () => {
    it('Should exist and be initialized', () => {
        expect(Map).to.exist;

        map = new Map(map1);

        expect(map).to.exist;
    });

    it('Should have correct tiles length', () => {
        expect(map).to.have.property('tiles');
        expect(map.tiles).to.have.lengthOf(1008);
    });

    it('Should get tile', () => {
        let tile = map.getTile(0, 0);

        expect(tile).to.exist;

        expect(tile.getD()).to.be.an('object');

        expect(tile.getD().getU()).to.equal(tile);

        expect(tile.getR().getL()).to.equal(tile);
    });

    it('Should get negative positioned tile', () => {
        let tileA = map.getTile(-1, 0);

        expect(tileA).to.exist;

        let tileB = map.getTile(27, 0);

        expect(tileB).to.exist;

        expect(tileA).to.equal(tileB);
    });

    it('Shorthand code methods should work as espected', () => {
        for (let i = 0; i < map.tiles.length; i++) {
            let t = map.tiles[i];
            if (t.code === 'h') expect(t.isHouse()).to.be.true;
            if (t.code === '>') expect(t.isOnlyRight()).to.be.true;
            if (t.code === '<') expect(t.isOnlyLeft()).to.be.true;
            if (t.code === 'e') expect(t.isExit()).to.be.true;
            if (t.code === '=') expect(t.isWall()).to.be.true;
        }
    });
});

describe('Item', () => {
    let item;

    it('Should exist and be initialized', () => {
        item = new Item({
            map,
            width : 4,
            height : 4,
            x : 218,
            y : 424,

            animations : {
                default : new Animation({
                    imageURL : '../img/pills.png',
                    numberOfFrame : 1,
                    offsetX : 12
                })
            }
        });

        expect(item).to.exist;

        expect(item).to.have.property('el');

    });

    it('Should be in a tile', () => {
        expect(item.getTile()).to.be.an('object');
    });

    it('Should bind/trigger events', (done) => {
        item.on('custom-event', () => { done(); });
        item.emit('custom-event');
    });
});

describe('Pacman', () => {
    let pacman;

    it('Should exist and be initialized', () => {
        pacman = makeMsPacman({
            map,
            speed : 50,
            addGameGhostEatEventListener : () => {},
            addGameGhostModeFrightenedEnter : () => {},
            addGameGhostModeFrightenedExit : () => {}
        });

        expect(pacman).to.exist;

        expect(pacman).to.have.property('animations');
        expect(pacman).to.have.property('el');

    });

    it('Should be centered', () => {
        pacman.x = 16;
        pacman.y = 20;
        pacman.update();

        expect(pacman._isCentered()).to.equal(true);
    });

    it('Should get step', () => {
        pacman.step = 10;

        expect(pacman.getStep()).to.equal(5);
    });

    it('Should get min', () => {
        expect(pacman.getMin(4, 2, 1)).to.equal(1);
        expect(pacman.getMin(4, 0, 1)).to.equal(0);
        expect(pacman.getMin(4, -2, 1)).to.equal(-2);
    });
});
