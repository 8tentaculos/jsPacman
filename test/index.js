import chai from 'chai';
import Animation from '../src/js/engine/Animation';
import Map from '../src/js/Map';
import map1 from '../src/js/maps/map-1';
import Game from '../src/js/Game';
import Item from '../src/js/Item';
import makeMsPacman from '../src/js/factory/makeMsPacman';

const should = chai.should();

let map;

document.body.innerHTML = '<div id="playground"></div>';

describe('Map', function() {

    it('Should exist and be initialized', function() {
        should.exist(Map);

        map = new Map(map1);

        should.exist(map);
    });

    it('Should have correct tiles length', function() {
        map.should.have.property('tiles');
        map.tiles.length.should.equal(1008);
    });

    it('Should get tile', function() {
        let tile = map.getTile(0, 0);

        should.exist(tile);

        tile.getD().should.be.an('object');

        tile.getD().getU().should.equal(tile);

        tile.getR().getL().should.equal(tile);
    });

    it('Should get negative positioned tile', function() {
        let tileA = map.getTile(-1, 0);

        should.exist(tileA);

        let tileB = map.getTile(27, 0);

        should.exist(tileB);

        tileA.should.equal(tileB);
    });

    it('Shorthand code methods should work as espected', function() {

        for (let i = 0; i < map.tiles.length; i++) {
            let t = map.tiles[i];
            if (t.code === 'h') t.isHouse().should.be.true;
            if (t.code === '>') t.isOnlyRight().should.be.true;
            if (t.code === '<') t.isOnlyLeft().should.be.true;
            if (t.code === 'e') t.isExit().should.be.true;
            if (t.code === '=') t.isWall().should.be.true;
        }

    });

});

describe('Item', function() {
    let item;

    it('Should exist and be initialized', function() {
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

        should.exist(item);

        item.should.have.property('el');

    });

    it('Should be in a tile', function() {
        item.getTile().should.be.an('object');
    });

    it('Should bind/trigger events', function(done) {
        item.on('custom-event', function() { done(); });
        item.emit('custom-event');
    });



});

describe('Pacman', function() {
    let pacman;

    it('Should exist and be initialized', function() {
        pacman = makeMsPacman({
            map,
            speed : 50,
            addGameGhostEatEventListener : () => {},
            addGameGhostModeFrightenedEnter : () => {},
            addGameGhostModeFrightenedExit : () => {}
        });

        should.exist(pacman);

        pacman.should.have.property('animations');
        pacman.should.have.property('el');

    });

    it('Should be centered', function() {
        pacman.x = 16;
        pacman.y = 20;
        pacman.update();

        pacman._isCentered().should.equal(true);
    });

    it('Should get step', function() {
        pacman.step = 10;

        pacman.getStep().should.equal(5);
    });

    it('Should get min', function() {
        pacman.getMin(4, 2, 1).should.equal(1);
        pacman.getMin(4, 0, 1).should.equal(0);
        pacman.getMin(4, -2, 1).should.equal(-2);
    });

});
