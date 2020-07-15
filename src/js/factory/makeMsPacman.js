import $ from 'jquery';
import Pacman from '../Pacman';

export default (attrs) => new Pacman({
    id : 'bot-ms-pacman',
    preturn : true,
    x : 452,
    y : 848,
    ...attrs
});
