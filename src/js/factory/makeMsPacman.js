import $ from 'jquery';
import Pacman from '../Pacman';

export default (attrs) => new Pacman({
    id : 'bot-ms-pacman',
    preturn : true,
    x : 226,
    y : 424,
    ...attrs
});
