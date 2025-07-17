class OnScreenKeyboard {
    constructor() {
        this.input = document.getElementById('location-input');
        this.setupKeyboard();
    }

    setupKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.dataset.key;
                this.handleKeyPress(keyValue);
            });
        });
    }

    handleKeyPress(key) {
        const currentValue = this.input.value;

        switch (key) {
            case 'backspace':
                this.input.value = currentValue.slice(0, -1);
                break;
            case 'clear':
                this.input.value = '';
                break;
            case ' ':
                this.input.value = currentValue + ' ';
                break;
            default:
                this.input.value = currentValue + key;
                break;
        }

        document.getElementById('error-message').textContent = '';
    }
}