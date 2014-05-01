define([
    'jquery', 
    'Bot', 
    'Modes/Scatter', 
    'Modes/Chase', 
    'Modes/Frightened', 
    'Modes/House', 
    'Modes/Dead'
], function($, Bot, Scatter, Chase, Frightened, House, Dead) {
    return {
        Scatter : Scatter,
        Chase : Chase,
        Frightened : Frightened,
        House : House,
        Dead : Dead
    };
});