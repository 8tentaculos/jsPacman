import chai from 'chai';
import $ from 'jquery';
import '../src/js/jquery.gamequery-0.7.1';
import Scaling from '../src/js/Scaling';
import Map from '../src/js/Map';
import map1 from '../src/js/maps/map-1';
import Game from '../src/js/Game';
import Item from '../src/js/Item';
import makeMsPacman from '../src/js/factory/makeMsPacman';

const should = chai.should();
let pg;
let scaling;
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

describe('PlayGround', function() {
    it('Should exist and be initialized', function() {
        let el = $('#playground');

        should.exist(el);

        pg = $(el).playground({width : 100, height : 100, keyTracker : true});

        should.exist(pg);

        pg.should.have.property('addSprite');

    });
});


describe('Scaling', function() {
    it('Should exist and be initialized', function() {
        scaling = new Scaling(100, 100);

        should.exist(scaling);
    });
});

describe('Item', function() {
    let item;

    it('Should exist and be initialized', function() {
        item = new Item({
            pg,
            scaling,
            map,

            id : 'test-item',

            w : 4,
            h : 4,

            x : 218,
            y : 424,

            animations : {
                default : {
                    imageURL : '../img/pills.png',
                    numberOfFrame : 1,
                    offsetx : 12
                }
            }
        });

        should.exist(item);

        item.should.have.property('el');

    });

    it('Should be positioned', function() {
        item.getTile().should.be.an('object');

        item.x.should.equal(item.el.x() + parseInt(item.w / 2));
        item.y.should.equal(item.el.y() + parseInt(item.h / 2));
    });

    it('Should bind/trigger events', function(done) {
        item.on('custom-event', function() { done(); });
        item.trigger('custom-event');
    });



});

describe('Pacman', function() {
    let pacman;

    it('Should exist and be initialized', function() {
        pacman = makeMsPacman({
            map,
            pg,
            scaling,
            speed : 50
        });

        should.exist(pacman);

        pacman.should.have.property('animations');
        pacman.should.have.property('el');

    });

    it('Should be centered', function() {
        pacman.x = 16;
        pacman.y = 20;
        pacman.render();

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
