class TimeManager {
    constructor() {
        this.timeFormats = [
            { name: '24-hour', format: { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' } },
            { name: '12-hour', format: { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' } },
            { name: 'no-seconds', format: { hour12: false, hour: '2-digit', minute: '2-digit' } },
            { name: '12-hour-no-seconds', format: { hour12: true, hour: '2-digit', minute: '2-digit' } },
            { name: '24-hour-with-ms', format: { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }, includeMs: true }
        ];

        this.dateFormats = [
            { name: 'long', format: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } },
            { name: 'short', format: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' } },
            { name: 'numeric', format: { year: 'numeric', month: '2-digit', day: '2-digit' } },
            { name: 'compact', format: { month: 'short', day: 'numeric' } }
        ];

        this.currentTimeFormat = ps2Preferences.timeFormat;
        this.currentDateFormat = ps2Preferences.dateFormat;

        this.timer = null;

        this.setupClickHandlers();
        this.startTimer();
        this.updateTime();
    }

    setupClickHandlers() {
        document.getElementById('current-time').addEventListener('click', () => {
            this.currentTimeFormat = (this.currentTimeFormat + 1) % this.timeFormats.length;
            ps2Preferences.timeFormat = this.currentTimeFormat;
            localStorage.setItem('ps2Preferences', JSON.stringify(window.ps2Preferences));

            this.startTimer();
            this.updateTime();
        });

        document.getElementById('current-date').addEventListener('click', () => {
            this.currentDateFormat = (this.currentDateFormat + 1) % this.dateFormats.length;
            ps2Preferences.dateFormat = this.currentDateFormat;
            localStorage.setItem('ps2Preferences', JSON.stringify(window.ps2Preferences));

            this.updateTime();
        });
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        const timeFormat = this.timeFormats[this.currentTimeFormat];
        const interval = timeFormat.includeMs ? 50 : 1000;

        this.timer = setInterval(() => this.updateTime(), interval);
    }

    updateTime() {
        const now = new Date();
        const timeFormat = this.timeFormats[this.currentTimeFormat];

        let timeString = now.toLocaleTimeString('en-US', timeFormat.format);

        if (timeFormat.includeMs) {
            const ms = String(now.getMilliseconds()).padStart(3, '0');
            timeString += `.${ms}`;
        }

        const dateString = now.toLocaleDateString(
            'en-US',
            this.dateFormats[this.currentDateFormat].format
        );

        document.getElementById('current-time').textContent = timeString;
        document.getElementById('current-date').textContent = dateString;
    }
}