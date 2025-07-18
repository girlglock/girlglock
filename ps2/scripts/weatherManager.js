class WeatherManager {
    constructor() {
        this.currentWeather = null;
        this.isLoading = false;
        this.setupEventListeners();
        this.loadWeather();
        setInterval(() => this.loadWeather(), 30 * 60 * 1000);
    }

    setupEventListeners() {
        const weatherDisplay = document.getElementById('weather-display');
        const modal = document.getElementById('location-modal');
        const locationInput = document.getElementById('location-input');
        const saveButton = document.getElementById('save-button');
        const cancelButton = document.getElementById('cancel-button');
        const errorMessage = document.getElementById('error-message');

        weatherDisplay.addEventListener('click', () => {
            modal.style.display = 'flex';
            locationInput.value = ps2Preferences.weatherLocation;
            errorMessage.textContent = '';
        });

        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        saveButton.addEventListener('click', () => {
            this.saveLocation();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    async saveLocation() {
        const locationInput = document.getElementById('location-input');
        const modal = document.getElementById('location-modal');
        const errorMessage = document.getElementById('error-message');
        const newLocation = locationInput.value.trim();

        if (!newLocation) {
            errorMessage.textContent = 'Please enter a location';
            return;
        }

        try {
            const isValid = await this.testLocation(newLocation);
            if (isValid) {
                ps2Preferences.weatherLocation = newLocation;
                localStorage.setItem('ps2Preferences', JSON.stringify(window.ps2Preferences));
                modal.style.display = 'none';
                this.loadWeather();
            } else {
                errorMessage.textContent = 'not found, you tupid.';
            }
        } catch (error) {
            errorMessage.textContent = 'validating went wrong :(';
        }
    }

    async getCoordinates(location) {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return {
                    lat: data.results[0].latitude,
                    lon: data.results[0].longitude,
                    name: data.results[0].name,
                    country: data.results[0].country
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async testLocation(location) {
        const coords = await this.getCoordinates(location);
        return coords !== null;
    }

    getWeatherCondition(weatherCode) {
        const weatherCodes = {
            0: 'Clear',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Foggy',
            51: 'Light Peeing',
            53: 'Drizzle',
            55: 'Heavy Drizzle',
            61: 'Light Rain',
            63: 'Rain',
            65: 'Heavy Rain',
            71: 'Light Snow',
            73: 'Snow',
            75: 'Heavy Snow',
            80: 'Light Showers',
            81: 'Showers',
            82: 'Heavy Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm',
            99: 'Literally dying'
        };
        return weatherCodes[weatherCode] || 'Unknown';
    }

    async loadWeather() {
        if (this.isLoading) return;
        this.isLoading = true;
        const location = ps2Preferences.weatherLocation;

        try {
            const coords = await this.getCoordinates(location);
            if (!coords) throw new Error('location not found');
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`);
            if (!response.ok) throw new Error('weather API ewwow');
            const data = await response.json();
            this.currentWeather = {
                temperature: Math.round(data.current.temperature_2m),
                condition: this.getWeatherCondition(data.current.weather_code),
                location: coords.name
            };
            this.updateWeatherDisplay();
        } catch (error) {
            this.currentWeather = {
                temperature: Math.floor(Math.random() * 30) + 10,
                condition: ['Silly', 'Comfy'][Math.floor(Math.random() * 2)],
                location: location
            };
            this.updateWeatherDisplay();
        }

        this.isLoading = false;
    }

    updateWeatherDisplay() {
        const weatherDisplay = document.getElementById('weather-display');
        if (this.currentWeather) {
            weatherDisplay.innerHTML = `
                        <span class="weather-temp">${this.currentWeather.temperature}°</span>
                        <span class="weather-condition">${this.currentWeather.condition}</span>
                    `;
        } else {
            weatherDisplay.innerHTML = `
                        <span class="weather-temp">--°</span>
                        <span class="weather-condition">Loading...</span>
                    `;
        }
    }
}