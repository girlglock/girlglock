class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {
        const soundNames = ['hover', 'select'];
        soundNames.forEach(name => {
            const audio = new Audio(`Sounds/${name}.wav`);
            audio.volume = 0.1;
            audio.preload = 'auto';
            this.sounds[name] = audio;
        });
    }

    play(name) {
        if (this.sounds[name]) {
            try {
                const audioClone = this.sounds[name].cloneNode();
                audioClone.volume = this.sounds[name].volume;
                audioClone.play().catch(e => {
                    console.log('no sound due to browser policy:', e);
                });

                setTimeout(() => {
                    audioClone.src = '';
                }, 5000);
            } catch (error) {
                console.log('soundpl ay error:', error);
            }
        }
    }
}