class HeadsetManager {
    constructor() {
        this.device = null;
        this.batteryPercent = null;
        this.isQuerying = false;
        this.VID = 0x03F0;
        this.PID = 0x06BE;
        this.REPORT_ID = 12;
        this.CMD_BATTERY = 0x06;
        
        this.batteryDisplay = document.getElementById("battery-display");
        this.batteryIcon = document.getElementById("battery-icon");
        
        this.loadSavedDevice();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.batteryDisplay.addEventListener("click", async () => {
            if (!this.device) {
                await this.requestDevice();
            } else {
                await this.queryBattery();
            }
        });
    }

    async loadSavedDevice() {
        if (!navigator.hid) {
            this.updateDisplay("N/A", "WebHID not supported");
            return;
        }

        try {
            const devices = await navigator.hid.getDevices();
            const hyperxDevices = devices.filter(d => 
                d.vendorId === this.VID && d.productId === this.PID
            );

            if (hyperxDevices.length > 0) {
                this.device = hyperxDevices[0];
                
                if (!this.device.opened) {
                    await this.device.open();
                }

                await this.queryBattery();
            } else {
                this.updateDisplay("--", "Click to connect");
            }
        } catch (error) {
            this.updateDisplay("--", "Click to connect");
        }
    }

    async requestDevice() {
        try {
            const devices = await navigator.hid.requestDevice({
                filters: [{ vendorId: this.VID, productId: this.PID }]
            });

            if (devices.length > 0) {
                this.device = devices[0];
                
                if (!this.device.opened) {
                    await this.device.open();
                }

                await this.queryBattery();
            }
        } catch (error) {
            this.updateDisplay("--", "Connection failed");
        }
    }

    async queryBattery() {
        if (this.isQuerying || !this.device || !this.device.opened) {
            return;
        }
        
        this.isQuerying = true;
        
        try {
            const batteryPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.device.removeEventListener("inputreport", handler);
                    reject(new Error("timeour"));
                }, 3000);

                const handler = (event) => {
                    
                    if (event.reportId === this.REPORT_ID) {
                        const data = new Uint8Array(event.data.buffer);
                        let battery = null;
                        
                        if (data[4] === this.CMD_BATTERY) {
                            battery = data[5];
                        } else if (data[5] === this.CMD_BATTERY) {
                            battery = data[6];
                        }
                        
                        clearTimeout(timeout);
                        this.device.removeEventListener("inputreport", handler);
                        resolve(battery);
                    }
                };
                
                this.device.addEventListener("inputreport", handler);
            });

            const command = new Uint8Array([
                0x02, 0x03, 0x01, 0x00, this.CMD_BATTERY, 0x00,
                ...new Array(57).fill(0)
            ]);

            await this.device.sendReport(this.REPORT_ID, command);
            const battery = await batteryPromise;

            if (battery !== null && battery >= 0 && battery <= 100) {
                this.batteryPercent = battery;
                this.updateDisplay(battery);
            } else {
                this.updateDisplay("--", "Invalid response");
            }

        } catch (error) {
            this.updateDisplay("--", error.message);
        } finally {
            this.isQuerying = false;
        }
    }

    updateDisplay(percent, statusText = null) {
        if (statusText) {
            this.batteryDisplay.title = statusText;
        } else {
            this.batteryDisplay.title = `HyperX Cloud III\nBattery: ${percent}%\nClick to refresh`;
        }

        this.updateIcon(percent);
    }

    updateIcon(percent) {
        this.batteryIcon.className = "battery-icon";
        
        if (percent === "--" || percent === "N/A") {
            this.batteryIcon.classList.add("battery-unknown");
            this.batteryDisplay.querySelector(".battery-percent").textContent = "--";
            return;
        }

        this.batteryDisplay.querySelector(".battery-percent").textContent = `${percent}%`;

        if (percent >= 80) {
            this.batteryIcon.classList.add("battery-full");
        } else if (percent >= 50) {
            this.batteryIcon.classList.add("battery-medium");
        } else if (percent >= 20) {
            this.batteryIcon.classList.add("battery-low");
        } else {
            this.batteryIcon.classList.add("battery-critical");
        }
    }
}