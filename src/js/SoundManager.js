import Sound from './engine/Sound';

class SoundManager {
    constructor(options) {
        this.soundEnabled = !!options.soundEnabled;

        if (this.soundEnabled) {
            this.sounds = {
                intro : new Sound('audio/intro.mp3'),
                back : new Sound('audio/back.mp3'),
                dot : new Sound('audio/dot.mp3'),
                eaten : new Sound('audio/eaten.mp3'),
                eat : new Sound('audio/eat.mp3'),
                frightened : new Sound('audio/frightened.mp3'),
                dead : new Sound('audio/dead.mp3'),
                bonus : new Sound('audio/bonus.mp3'),
                life : new Sound('audio/life.mp3')
            };

            Object.keys(this.sounds).forEach(key => {
                options.addSound(this.sounds[key]);
            });
        }
    }

    play(label) {
        if (this.soundEnabled) this.sounds[label].play();
    }
}

export default SoundManager;
