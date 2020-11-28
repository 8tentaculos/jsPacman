import Pacman from '../Pacman';

export const SPRITE_MS_PACMAN = 'SPRITE_MS_PACMAN';

export default (options) => new Pacman({
    x : 452,
    y : 848,
    type : SPRITE_MS_PACMAN,
    ...options
});
