import $ from 'jquery';
import Pacman from '../Pacman';

export default (options) => new Pacman({
    preturn : true,
    x : 452,
    y : 848,
    ...options
});
