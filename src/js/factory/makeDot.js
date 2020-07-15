import $ from 'jquery';
import Item from '../Item';

export default (attrs) => new Item({
    w : 8,
    h : 8,
    animationBase  : {
        imageURL : 'img/pills.png',
        numberOfFrame : 1
    },
    defaultAnimation : 'white',
    animations : {
        white : {
            offsetx : 24
        },
        yellow : {
            offsetx : 24 + 32
        },
        red : {
            offsetx : 24 + 32 * 2
        }
    },
    ...attrs
});
