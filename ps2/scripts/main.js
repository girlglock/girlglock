window.userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {
    timeFormat: 0,
    dateFormat: 0,
    weatherLocation: 'Hannover'
};

const canvas = document.getElementById('dotsCanvas');
new SillyDots(canvas);
new TimeManager();
new WeatherManager();
new OnScreenKeyboard();
const soundManager = new SoundManager();

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.color = '#6398c2';
        new SoundManager().play('hover');
    });
    item.addEventListener('mouseleave', () => {
        item.style.color = '#6b6a6f';
    });

    item.addEventListener('click', () => {
        new SoundManager().play('select');
    });
});