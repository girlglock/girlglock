window.ps2Preferences = JSON.parse(localStorage.getItem('ps2Preferences')) || {
    timeFormat: 0,
    dateFormat: 0,
    weatherLocation: 'Hannover'
};

const canvas = document.getElementById('dotsCanvas');
new SillyDots(canvas);
new TimeManager();
new WeatherManager();
new OnScreenKeyboard();
new HeadsetManager();
const soundManager = new SoundManager();

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.color = '#6398c2';
        soundManager.play('hover');
    });
    item.addEventListener('mouseleave', () => {
        item.style.color = '#6b6a6f';
    });

    item.addEventListener('click', () => {
        soundManager.play('select');
    });
});