import Mode from './Mode';

class Chase extends Mode {
    _getTarget() {
        return this.ghost.getChaseTarget();
    }
}

export default Chase;
