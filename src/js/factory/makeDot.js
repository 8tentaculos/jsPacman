import $ from 'jquery';
import Item from '../Item';

export default (attrs) => new Item({
    w : 4,
    h : 4,
    animationBase  : {
        imageURL : 'img/pills.png',
        numberOfFrame : 1
    },
    defaultAnimation : 'white',
    animations : {
        white : {
            offsetx : 12
        },
        yellow : {
            offsetx : 12 + 16
        },
        red : {
            offsetx : 12 + 16 * 2
        }
    },
    ...attrs
});
