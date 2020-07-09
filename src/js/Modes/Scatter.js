import $ from 'jquery';
import Bot from '../Bot';
import Mode from './Mode';

class Scatter extends Mode {
    _getTarget() {
        return this.ghost.scatterTarget;
    }
}

export default Scatter;
