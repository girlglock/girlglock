class MouseManager {
    constructor() {
        this.device = null;
        this.readerDevice = null;
        this.batteryPercent = null;
        this.isCharging = false;
        this.isQuerying = false;
        this.currentBackend = null;

        this.X2CL = {
            NAME: "x2cl",
            VID: 0x3710,
            PID_WIRELESS: 0x5406,
            PID_WIRED: 0x3414,
            USAGE_PAGE: 0xFF02,
            OUTPUT_REPORT_ID: 0x08,
            INPUT_REPORT_ID: 0x08,
            CMD04_PACKET: new Uint8Array([0x08, 0x04, ...new Array(14).fill(0x00), 0x49]),
            CMD03_PACKET: new Uint8Array([0x08, 0x03, ...new Array(14).fill(0x00), 0x4A]),
            CMD01_PACKET_A: new Uint8Array([0x08, 0x01, 0x00, 0x00, 0x00, 0x08, 0x8e, 0x0c, 0x4d, 0x4c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11]),
            CMD01_PACKET_B: new Uint8Array([0x08, 0x01, 0x00, 0x00, 0x00, 0x08, 0x95, 0x05, 0xdd, 0x4b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x82]),
            CMD02_PACKET: new Uint8Array([0x08, 0x02, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x49])
        };

        this.X2V1 = {
            NAME: "x2v1",
            VID: 0x25A7,
            PID_WIRELESS: 0xFA7C,
            PID_WIRED: 0xFA7B,
            OUTPUT_REPORT_ID: 0x08,
            INPUT_REPORT_IDS: [0x08, 0x09],
            DEFAULT_INPUT_REPORT_ID: 0x09,
            CMD04_PACKET: new Uint8Array([0x08, 0x04, ...new Array(14).fill(0x00), 0x49]),
            CMD03_PACKET: new Uint8Array([0x08, 0x03, ...new Array(14).fill(0x00), 0x4A]),
            CMD0E_PACKET: new Uint8Array([0x08, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3f])
        };

        this.mouseDisplay = document.getElementById("mouse-display");
        this.mouseIcon = document.getElementById("mouse-icon");

        if (!this.mouseDisplay || !this.mouseIcon) {
            console.error("mouse html not found");
            return;
        }

        this.loadSavedDevice();
        this.setupEventListeners();
    }

    buildCmd01Packet() {
        const nonce = new Uint8Array(new Uint32Array([Date.now() & 0xFFFFFFFF]).buffer);
        const body = new Uint8Array([
            0x08, 0x01, 0x00, 0x00, 0x00, 0x08,
            ...nonce,
            ...new Array(6).fill(0x00)
        ]);
        const sum = body.reduce((acc, val) => acc + val, 0) & 0xFF;
        const checksum = (0x55 - sum) & 0xFF;
        return new Uint8Array([...body, checksum]);
    }

    setupEventListeners() {
        this.mouseDisplay.addEventListener("click", async () => {
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

            let pulsarDevices = devices.filter(d => {
                const match = d.vendorId === this.X2CL.VID &&
                    (d.productId === this.X2CL.PID_WIRELESS || d.productId === this.X2CL.PID_WIRED) &&
                    d.collections.some(c => c.usagePage === this.X2CL.USAGE_PAGE);

                if (d.vendorId === this.X2CL.VID) {
                    console.log("maybe X2CL:", {
                        vid: '0x' + d.vendorId.toString(16),
                        pid: '0x' + d.productId.toString(16),
                        collections: d.collections.map(c => ({ usagePage: '0x' + c.usagePage.toString(16) })),
                        match
                    });
                }

                return match;
            });

            if (pulsarDevices.length > 0) {
                console.log("found x2 crazylight");
                this.currentBackend = this.X2CL;
                this.device = pulsarDevices[0];

                if (!this.device.opened) {
                    await this.device.open();
                }

                await this.queryBattery();
                return;
            }

            pulsarDevices = devices.filter(d => {
                const match = d.vendorId === this.X2V1.VID &&
                    (d.productId === this.X2V1.PID_WIRELESS || d.productId === this.X2V1.PID_WIRED);

                if (d.vendorId === this.X2V1.VID) {
                    console.log("maybe x2v1:", {
                        vid: '0x' + d.vendorId.toString(16),
                        pid: '0x' + d.productId.toString(16),
                        collections: d.collections.map(c => ({
                            usagePage: '0x' + c.usagePage.toString(16),
                            usage: '0x' + c.usage.toString(16)
                        })),
                        match
                    });
                }

                return match;
            });

            if (pulsarDevices.length > 0) {
                this.currentBackend = this.X2V1;
                await this.setupX2V1Devices(pulsarDevices);
                return;
            }
            this.updateDisplay("--", "Click to connect");
        } catch (error) {
            console.error(error);
            this.updateDisplay("--", "Click to connect");
        }
    }

    async setupX2V1Devices(devices) {
        const sorted = devices.sort((a, b) => {
            const getScore = (d) => {
                let score = 0;
                if (d.collections.some(c => c.usagePage === 0xFF01)) score += 100;
                if (d.collections.some(c => c.usagePage >= 0xFF00)) score += 50;
                return score;
            };
            return getScore(b) - getScore(a);
        });

        this.device = sorted[0];

        const readerCandidate = sorted.find(d =>
            d.collections.some(c => c.usagePage === 0xFF01)
        );
        this.readerDevice = readerCandidate || this.device;

        if (!this.device.opened) {
            await this.device.open();
        }

        if (this.readerDevice !== this.device && !this.readerDevice.opened) {
            await this.readerDevice.open();
        }

        await this.queryBattery();
    }

    async requestDevice() {
        try {
            let devices = await navigator.hid.requestDevice({
                filters: [
                    { vendorId: this.X2CL.VID, productId: this.X2CL.PID_WIRELESS },
                    { vendorId: this.X2CL.VID, productId: this.X2CL.PID_WIRED }
                ]
            });

            if (devices.length > 0) {
                const device = devices.find(d =>
                    d.collections.some(c => c.usagePage === this.X2CL.USAGE_PAGE)
                );

                if (device) {
                    this.currentBackend = this.X2CL;
                    this.device = device;

                    if (!this.device.opened) {
                        await this.device.open();
                    }

                    await this.queryBattery();
                    return;
                }
            }
        } catch (error) {
            console.error(error);
        }

        try {
            let devices = await navigator.hid.requestDevice({
                filters: [
                    { vendorId: this.X2V1.VID, productId: this.X2V1.PID_WIRELESS },
                    { vendorId: this.X2V1.VID, productId: this.X2V1.PID_WIRED }
                ]
            });

            if (devices.length > 0) {
                this.currentBackend = this.X2V1;
                await this.setupX2V1Devices(devices);
                return;
            }
        } catch (error) {
            console.error(error);
            this.updateDisplay("--", "Connection failed");
        }
    }

    parseBatteryPayload(payload) {
        if (payload.length < 8) {
            console.log("payload too short:", payload.length);
            return null;
        }

        const battery = payload[5];
        const charging = payload[6] !== 0x00;

        console.log("Battery:", battery, "Charging:", charging);

        return { battery, charging };
    }

    async queryBattery() {
        if (this.isQuerying || !this.device || !this.device.opened || !this.currentBackend) {
            return;
        }

        this.isQuerying = true;

        try {
            if (this.currentBackend.NAME === "x2cl") {
                await this.queryBatteryX2CL();
            } else {
                await this.queryBatteryX2V1();
            }
        } catch (error) {
            console.error("battery query ewwor:", error);
            this.updateDisplay("--", error.message || "ewwor");
        } finally {
            this.isQuerying = false;
        }
    }

    async queryBatteryX2CL() {
        const sendAndWait = async (packet) => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.device.removeEventListener("inputreport", handler);
                    reject(new Error("timeout"));
                }, 2000);

                const handler = (event) => {
                    if (event.reportId === this.X2CL.INPUT_REPORT_ID) {
                        const data = new Uint8Array(event.data.buffer);

                        if (data.length >= 7 && data[0] === 0x04) {
                            const parsed = this.parseBatteryPayload(data);
                            clearTimeout(timeout);
                            this.device.removeEventListener("inputreport", handler);
                            resolve(parsed);
                        }
                    }
                };

                this.device.addEventListener("inputreport", handler);

                this.device.sendReport(this.X2CL.OUTPUT_REPORT_ID, packet.slice(1))
                    .then(() => {
                        return new Promise(resolve => setTimeout(resolve, 20));
                    })
                    .catch(err => {
                        clearTimeout(timeout);
                        this.device.removeEventListener("inputreport", handler);
                        reject(err);
                    });
            });
        };

        try {
            const result = await sendAndWait(this.X2CL.CMD04_PACKET);

            if (result && result.battery >= 0 && result.battery <= 100) {
                this.batteryPercent = result.battery;
                this.isCharging = result.charging;
                this.updateDisplay(result.battery, null, result.charging);
                return;
            }
        } catch (error) {
            console.log(error.message);
        }

        const initSequence = [
            this.X2CL.CMD01_PACKET_A,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD01_PACKET_A,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD01_PACKET_A,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD01_PACKET_B,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD02_PACKET,
            this.X2CL.CMD03_PACKET,
            this.X2CL.CMD03_PACKET,
        ];

        for (const packet of initSequence) {
            await this.device.sendReport(this.X2CL.OUTPUT_REPORT_ID, packet.slice(1));
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const result = await sendAndWait(this.X2CL.CMD04_PACKET);

        if (result && result.battery >= 0 && result.battery <= 100) {
            this.batteryPercent = result.battery;
            this.isCharging = result.charging;
            this.updateDisplay(result.battery, null, result.charging);
        } else {
            this.updateDisplay("--", "Invalid response");
        }
    }

    async queryBatteryX2V1() {
        const reader = this.readerDevice || this.device;

        const sendAndWait = async (packet, useFeature = true) => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reader.removeEventListener("inputreport", handler);
                    reject(new Error("timeout"));
                }, 2000);

                const handler = (event) => {
                    if (this.X2V1.INPUT_REPORT_IDS.includes(event.reportId)) {
                        const data = new Uint8Array(event.data.buffer);

                        if (data.length >= 7 && data[0] === 0x04) {
                            const parsed = this.parseBatteryPayload(data);
                            clearTimeout(timeout);
                            reader.removeEventListener("inputreport", handler);
                            resolve(parsed);
                        }
                    }
                };

                reader.addEventListener("inputreport", handler);

                const sendPromise = useFeature ?
                    this.device.sendFeatureReport(this.X2V1.OUTPUT_REPORT_ID, packet.slice(1)) :
                    this.device.sendReport(this.X2V1.OUTPUT_REPORT_ID, packet.slice(1));

                sendPromise
                    .then(() => {

                        return new Promise(resolve => setTimeout(resolve, 20));
                    })
                    .catch(err => {
                        clearTimeout(timeout);
                        reader.removeEventListener("inputreport", handler);
                        reject(err);
                    });
            });
        };

        try {
            const result = await sendAndWait(this.X2V1.CMD04_PACKET, true);

            if (result && result.battery >= 0 && result.battery <= 100) {
                this.batteryPercent = result.battery;
                this.isCharging = result.charging;
                this.updateDisplay(result.battery, null, result.charging);
                return;
            }
        } catch (error) {
            try {
                const result = await sendAndWait(this.X2V1.CMD04_PACKET, false);

                if (result && result.battery >= 0 && result.battery <= 100) {
                    this.batteryPercent = result.battery;
                    this.isCharging = result.charging;
                    this.updateDisplay(result.battery, null, result.charging);
                    return;
                }
            } catch (error2) {
                console.log(error2.message);
            }
        }

        const warmupSequence = [
            this.buildCmd01Packet(),
            this.X2V1.CMD03_PACKET,
            this.X2V1.CMD0E_PACKET
        ];

        for (const packet of warmupSequence) {
            try {
                await this.device.sendFeatureReport(this.X2V1.OUTPUT_REPORT_ID, packet.slice(1));
            } catch {
                try {
                    await this.device.sendOutputReport(this.X2V1.OUTPUT_REPORT_ID, packet.slice(1));
                } catch (err) {
                    console.log(err);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        try {
            const result = await sendAndWait(this.X2V1.CMD04_PACKET, true);

            if (result && result.battery >= 0 && result.battery <= 100) {
                this.batteryPercent = result.battery;
                this.isCharging = result.charging;
                this.updateDisplay(result.battery, null, result.charging);
                return;
            }
        } catch {
            try {
                const result = await sendAndWait(this.X2V1.CMD04_PACKET, false);

                if (result && result.battery >= 0 && result.battery <= 100) {
                    this.batteryPercent = result.battery;
                    this.isCharging = result.charging;
                    this.updateDisplay(result.battery, null, result.charging);
                    return;
                }
            } catch (error) {
                this.updateDisplay("--", "...");
            }
        }

        this.updateDisplay("--", "ewwor");
    }

    updateDisplay(percent, statusText = null, charging = false) {
        if (statusText) {
            this.mouseDisplay.title = statusText;
        } else {
            const deviceName = this.currentBackend ?
                (this.currentBackend.NAME === "x2cl" ? "Pulsar X2 Crazylight" : "Pulsar X2 V1") :
                "Pulsar Mouse";
            this.mouseDisplay.title = `${deviceName}\nBattery: ${percent}%${charging ? " ⚡" : ""}\nClick to refresh`;
        }

        this.updateIcon(percent, charging);
    }

    updateIcon(percent, charging = false) {
        this.mouseIcon.className = "battery-icon";

        if (percent === "--" || percent === "N/A") {
            this.mouseIcon.classList.add("battery-unknown");
            this.mouseDisplay.querySelector(".battery-percent").textContent = "--";
            return;
        }

        const displayText = charging ? `${percent}%⚡` : `${percent}%`;
        this.mouseDisplay.querySelector(".battery-percent").textContent = displayText;

        if (percent >= 80) {
            this.mouseIcon.classList.add("battery-full");
        } else if (percent >= 50) {
            this.mouseIcon.classList.add("battery-medium");
        } else if (percent >= 20) {
            this.mouseIcon.classList.add("battery-low");
        } else {
            this.mouseIcon.classList.add("battery-critical");
        }
    }
}