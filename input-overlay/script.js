const keyboardLayoutDef = [
    [
        { key: "key_escape", label: "ESC", class: "invisible" },
        { key: "key_1", label: "1" },
        { key: "key_2", label: "2" },
        { key: "key_3", label: "3" },
        { key: "key_4", label: "4" }
    ],
    [
        { key: "key_tab", label: "TAB", class: "wide" },
        { key: "key_q", label: "Q" },
        { key: "key_w", label: "W" },
        { key: "key_e", label: "E" },
        { key: "key_r", label: "R" }
    ],
    [
        { key: "key_leftshift", label: "SHIFT", class: "extra-wide" },
        { key: "key_a", label: "A" },
        { key: "key_s", label: "S" },
        { key: "key_d", label: "D" },
        { key: "key_f", label: "F" }
    ],
    [
        { key: "key_leftctrl", label: "CTRL", class: "wide" },
        { key: "key_leftalt", label: "ALT", class: "wide" },
        { key: "key_space", label: "SPACE", class: "super-wide" }
    ]
];

const keycodemap = {
    2: "key_1", 3: "key_2", 4: "key_3", 5: "key_4",
    16: "key_q", 17: "key_w", 18: "key_e", 19: "key_r",
    30: "key_a", 31: "key_s", 32: "key_d", 33: "key_f",
    42: "key_leftshift", 29: "key_leftctrl", 56: "key_leftalt",
    15: "key_tab", 57: "key_space", 1: "key_escape"
};

const browserCodeToKeyName = {
    "escape": "key_escape", "digit1": "key_1", "digit2": "key_2", "digit3": "key_3", "digit4": "key_4",
    "tab": "key_tab", "keyq": "key_q", "keyw": "key_w", "keye": "key_e", "keyr": "key_r",
    "shiftleft": "key_leftshift", "keya": "key_a", "keys": "key_s", "keyd": "key_d", "keyf": "key_f",
    "controlleft": "key_leftctrl", "altleft": "key_leftalt", "space": "key_space"
};

const mousebuttonmap = {
    1: "mouse_left", 2: "mouse_right", 3: "mouse_middle"
};

const browserButtonToKeyName = { 0: "mouse_left", 2: "mouse_right", 1: "mouse_middle" };

let previewElements = null;
let activeKeys = new Set();
let activeMouseButtons = new Set();
let currentScrollCount = 0;
let lastScrollDirection = null;
let scrollTimeout;

function buildInterface(keyboardContainer, mouseContainer) {
    if (!keyboardContainer || !mouseContainer) return null;

    keyboardContainer.innerHTML = "";
    mouseContainer.innerHTML = "";

    const keyElements = new Map();
    const mouseElements = new Map();

    keyboardLayoutDef.forEach(row => {
        const rowEl = document.createElement("div");
        rowEl.className = "key-row";
        row.forEach(item => {
            const keyEl = document.createElement("div");
            keyEl.className = "key" + (item.class ? " " + item.class : "");
            keyEl.textContent = item.label;
            keyEl.dataset.key = item.key;
            rowEl.appendChild(keyEl);
            if (!item.class || item.class !== "invisible") {
                keyElements.set(item.key, keyEl);
            }
        });
        keyboardContainer.appendChild(rowEl);
    });

    const mouseRow = document.createElement("div");
    mouseRow.className = "mouse-row";

    const leftBtn = document.createElement("div");
    leftBtn.className = "mouse-btn";
    leftBtn.textContent = "M1";
    leftBtn.dataset.button = "mouse_left";
    mouseRow.appendChild(leftBtn);
    mouseElements.set("mouse_left", leftBtn);

    const scrollDisplay = document.createElement("div");
    scrollDisplay.className = "scroll-display";
    scrollDisplay.id = "scrolldisplay"; 
    
    const scrollArrow = document.createElement("span");
    scrollArrow.className = "scroll-arrow";
    scrollArrow.textContent = "-";
    
    const scrollCount = document.createElement("span");
    scrollCount.className = "scroll-count";
    
    scrollDisplay.appendChild(scrollArrow);
    scrollDisplay.appendChild(scrollCount);
    mouseRow.appendChild(scrollDisplay);

    const rightBtn = document.createElement("div");
    rightBtn.className = "mouse-btn";
    rightBtn.textContent = "M2";
    rightBtn.dataset.button = "mouse_right";
    mouseRow.appendChild(rightBtn);
    mouseElements.set("mouse_right", rightBtn);

    const mouseSection = document.createElement("div");
    mouseSection.className = "mouse-section";
    mouseSection.appendChild(mouseRow);
    mouseContainer.appendChild(mouseSection);

    return { keyElements, mouseElements, scrollDisplay, scrollArrow, scrollCount };
}

function applyStyles(opts) {
    const pressscalevalue = parseInt(opts.pressscale) / 100;
    const animDuration = (0.15 * (100 / parseInt(opts.animationspeed))) + "s";
    
    if (opts.fontfamily) {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=" + opts.fontfamily.replace(/ /g, "+") + "&display=swap";
        link.rel = "stylesheet";
        document.head.querySelectorAll("link[href*='fonts.googleapis']").forEach(el => el.remove());

        document.head.appendChild(link);
        document.body.style.fontFamily = `"${opts.fontfamily}", sans-serif`;
    } else {
        document.head.querySelectorAll("link[href*='fonts.googleapis']").forEach(el => el.remove());
        document.body.style.fontFamily = "";
    }

    let styleEl = document.getElementById("dynamic-styles");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "dynamic-styles";
        document.head.appendChild(styleEl);
    }

    const css = `
        .key, .mouse-btn, .scroll-display {
            border-radius: ${opts.borderradius}px !important;
            color: ${opts.inactivecolor} !important;
            background: ${opts.backgroundcolor} !important;
            border-color: ${opts.outlinecolor} !important;
            transition: all ${animDuration} cubic-bezier(0.4,0,0.2,1) !important;
            position: relative !important;
        }
        .key.active, .mouse-btn.active, .scroll-display.active {
            border-color: ${opts.activecolor} !important;
            box-shadow: 0 2px ${opts.glowradius}px ${opts.activecolor} !important;
            color: ${opts.fontcolor} !important;
            transform: translateY(-2px) scale(${pressscalevalue}) !important;
        }
        .key.active::before, .mouse-btn.active::before, .scroll-display.active::before {
            background: linear-gradient(135deg, ${opts.activecolor}4d, ${opts.activecolor}4d) !important;
        }
        .scroll-count {
            color: ${opts.fontcolor} !important;
        }
        .mouse-section {
            display: ${opts.hidemouse ? "none" : "flex"} !important;
        }
    `;

    styleEl.textContent = css;
}

function handlePreviewInput(event, els, type) {
    if (!els) return;

    const isTypingField = event.target.matches("input[type='text'], input[type='number'], .color-hex-input");

    if (type === "key_pressed" || type === "key_released") {
        const keyName = browserCodeToKeyName[event.code.toLowerCase()];
        
        if (keyName) {
            const el = els.keyElements.get(keyName);
            
            if (el) {
                if (type === "key_pressed" && !activeKeys.has(keyName)) {
                    el.classList.add("active");
                    activeKeys.add(keyName);
                } else if (type === "key_released") {
                    el.classList.remove("active");
                    activeKeys.delete(keyName);
                }

                const functionalKeysToBlockInInputs = ["key_leftctrl", "key_leftalt", "key_leftshift"];
                
                if (isTypingField) {
                    if (functionalKeysToBlockInInputs.includes(keyName)) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            }
        }
    }
    else if (type === "mouse_pressed" || type === "mouse_released") {
        const btnName = browserButtonToKeyName[event.button];
        if (btnName) {
            const el = els.mouseElements.get(btnName);
            if (el) {
                if (type === "mouse_pressed" && !activeMouseButtons.has(btnName)) {
                    el.classList.add("active");
                    activeMouseButtons.add(btnName);
                } else if (type === "mouse_released") {
                    el.classList.remove("active");
                    activeMouseButtons.delete(btnName);
                }
            }
        }
    }
    else if (type === "mouse_wheel") {
        const dir = Math.sign(event.deltaY);
        if (dir === 0) return;
        event.preventDefault();

        const opts = getCurrentSettings();
        const speed = opts.animationspeed;

        if (lastScrollDirection !== null && lastScrollDirection !== dir) {
            currentScrollCount = 0;
        }
        lastScrollDirection = dir;
        currentScrollCount++;

        els.scrollArrow.textContent = dir === -1 ? "↑" : "↓";
        
        requestAnimationFrame(() => {
            els.scrollCount.textContent = currentScrollCount + "x";
            els.scrollCount.classList.remove("animate");
            void els.scrollCount.offsetWidth;
            els.scrollCount.classList.add("animate");
            els.scrollDisplay.classList.add("active");
        });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            els.scrollArrow.textContent = "-";
            els.scrollCount.textContent = "";
            els.scrollDisplay.classList.remove("active");
            lastScrollDirection = null;
            currentScrollCount = 0;
        }, 150 * (100 / parseInt(speed)));
    }
}

function getCurrentSettings() {
    return {
        wsaddress: document.getElementById("wsaddress").value || "localhost",
        wsport: document.getElementById("wsport").value || "16899",
        activecolor: document.getElementById("activecolor").value,
        inactivecolor: document.getElementById("inactivecolor").value,
        backgroundcolor: document.getElementById("backgroundcolor").value,
        outlinecolor: document.getElementById("outlinecolor").value,
        fontcolor: document.getElementById("fontcolor").value,
        glowradius: document.getElementById("glowradius").value,
        borderradius: document.getElementById("borderradius").value,
        pressscale: document.getElementById("pressscale").value,
        animationspeed: document.getElementById("animationspeed").value,
        scale: document.getElementById("scale").value,
        opacity: document.getElementById("opacity").value,
        fontfamily: document.getElementById("fontfamily").value,
        hidemouse: document.getElementById("hidemouse").checked
    };
}

const urlParams = new URLSearchParams(window.location.search);
const isOverlayMode = urlParams.has("ws");

if (isOverlayMode) {
    document.getElementById("configurator").style.display = "none";
    document.getElementById("overlay").classList.add("show");
    initOverlayMode();
} else {
    initConfiguratorMode();
}

function initConfiguratorMode() {
    const previewKeys = document.getElementById("preview-keyboard");
    const previewMouse = document.getElementById("preview-mouse");
    previewElements = buildInterface(previewKeys, previewMouse);

    const inputs = document.querySelectorAll(".config-input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if(input.type === "range") {
                const label = document.getElementById(input.id + "value");
                if(label) {
                    let suffix = "";
                    if(input.id.includes("radius")) suffix = "px";
                    else if(input.id.includes("speed") || input.id.includes("scale")) suffix = "x";
                    else if(input.id === "opacity") suffix = "%";
                    
                    let val = input.value;
                    if(input.id.includes("scale") || input.id.includes("speed")) val = (val/100).toFixed(input.id === "pressscale" ? 2 : 1);
                    
                    label.textContent = val + suffix;
                }
            } else if (input.classList.contains("color-picker")) {
                const hexInput = document.getElementById(input.id + "hex");
                hexInput.value = input.value.toLowerCase();
            } else if (input.classList.contains("color-hex-input")) {
                let val = input.value.toLowerCase().replace(/[^0-9a-f#]/g, "");
                if (!val.startsWith("#")) val = "#" + val;
                if (val.length > 7) val = val.substring(0, 7);
                input.value = val;

                if (val.length === 7) {
                    const colorPicker = document.getElementById(input.id.replace("hex", ""));
                    colorPicker.value = val;
                } else {
                    return;
                }
            }
            updateState();
        });
    });

    document.getElementById("copybtn").addEventListener("click", copyLink);
    document.addEventListener("keydown", e => handlePreviewInput(e, previewElements, "key_pressed"), { capture: true });
    document.addEventListener("keyup", e => handlePreviewInput(e, previewElements, "key_released"), { capture: true });

    const previewWrapper = document.getElementById("preview-wrapper");
    if (previewWrapper) {
        previewWrapper.addEventListener("mousedown", e => handlePreviewInput(e, previewElements, "mouse_pressed"));
        previewWrapper.addEventListener("mouseup", e => handlePreviewInput(e, previewElements, "mouse_released"));
        previewWrapper.addEventListener("wheel", e => handlePreviewInput(e, previewElements, "mouse_wheel"), { passive: false });
    }

    updateState();
}

function updateState() {
    const settings = getCurrentSettings();

    applyStyles(settings);

    const previewContainer = document.querySelector(".preview-container");
    const scaleVal = parseInt(settings.scale) / 100;
    const opacityVal = parseInt(settings.opacity) / 100;
    if(previewContainer) {
        previewContainer.style.transform = `scale(${scaleVal})`;
        previewContainer.style.opacity = opacityVal;
        previewContainer.style.transformOrigin = "center";
    }

    const params = new URLSearchParams();
    params.set("ws", settings.wsaddress + ":" + settings.wsport);
    params.set("activecolor", settings.activecolor.toLowerCase());
    params.set("inactivecolor", settings.inactivecolor.toLowerCase());
    params.set("backgroundcolor", settings.backgroundcolor.toLowerCase());
    params.set("outlinecolor", settings.outlinecolor.toLowerCase());
    params.set("fontcolor", settings.fontcolor.toLowerCase());
    params.set("glow", settings.glowradius);
    params.set("radius", settings.borderradius);
    params.set("pressscale", settings.pressscale);
    params.set("speed", settings.animationspeed);
    params.set("scale", settings.scale);
    params.set("opacity", settings.opacity);
    if (settings.fontfamily) params.set("fontfamily", settings.fontfamily.toLowerCase());
    if (settings.hidemouse) params.set("hidemouse", "1");

    const link = window.location.origin + window.location.pathname + "?" + params.toString();
    document.getElementById("generatedlink").value = link;
}

async function copyLink() {
    const linkInput = document.getElementById("generatedlink");
    const copyBtn = document.getElementById("copybtn");
    try {
        await navigator.clipboard.writeText(linkInput.value);
        copyBtn.textContent = "copied";
        copyBtn.classList.add("copied");
        setTimeout(() => {
            copyBtn.textContent = "copy";
            copyBtn.classList.remove("copied");
        }, 2000);
    } catch (err) {
        linkInput.select();
        document.execCommand("copy");
    }
}

function initOverlayMode() {
    const statusEl = document.getElementById("status");
    
    const settings = {
        activecolor: urlParams.get("activecolor") || "#8b5cf6",
        inactivecolor: urlParams.get("inactivecolor") || "#808080",
        backgroundcolor: urlParams.get("backgroundcolor") || "#1a1a1a",
        outlinecolor: urlParams.get("outlinecolor") || "#4f4f4f",
        fontcolor: urlParams.get("fontcolor") || "#ffffff",
        glowradius: urlParams.get("glow") || "24",
        borderradius: urlParams.get("radius") || "8",
        pressscale: urlParams.get("pressscale") || "105",
        animationspeed: urlParams.get("speed") || "100",
        scale: urlParams.get("scale") || "100",
        opacity: urlParams.get("opacity") || "100",
        fontfamily: urlParams.get("fontfamily") || "",
        hidemouse: urlParams.get("hidemouse") === "1"
    };

    document.body.style.transform = `scale(${parseInt(settings.scale) / 100})`;
    document.body.style.transformOrigin = "top left";
    document.body.style.opacity = (parseInt(settings.opacity) / 100).toString();

    applyStyles(settings);

    const keyboardTarget = document.getElementById("keyboard-target");
    const mouseTarget = document.getElementById("mouse-target");
    const elements = buildInterface(keyboardTarget, mouseTarget); 
    
    const wsConfig = (urlParams.get("ws") || "").split(":");
    const wsAddress = wsConfig[0] || "localhost";
    const wsPort = wsConfig[1] || "16899";
    const wsUrl = `ws://${wsAddress}:${wsPort}/`;

    let ws;
    let connectionAttempts = 0;
    const activeKeys = new Set();
    const activeMouseButtons = new Set();
    let currentScrollCount = 0;
    let lastScrollDirection = null;
    let scrollTimeout;

    function connect() {
        connectionAttempts++;
        statusEl.textContent = `connecting to ${wsUrl} (attempt ${connectionAttempts})...`;
        statusEl.className = "status connecting";

        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            connectionAttempts = 0;
            statusEl.textContent = "connected";
            statusEl.className = "status connected";
            clearStuckKeys();
        };

        ws.onmessage = (e) => {
            handleInput(e.data, elements, activeKeys, activeMouseButtons, settings.animationspeed);
        };

        ws.onerror = () => {
            statusEl.textContent = "connection failed";
            statusEl.className = "status error";
        };

        ws.onclose = () => {
            statusEl.textContent = "disconnected. reconnecting...";
            statusEl.className = "status connecting";
            clearStuckKeys();
            setTimeout(connect, 2000);
        };
    }

    function clearStuckKeys() {
        elements.keyElements.forEach(el => el.classList.remove("active"));
        elements.mouseElements.forEach(el => el.classList.remove("active"));
        activeKeys.clear();
        activeMouseButtons.clear();
        elements.scrollDisplay.classList.remove("active");
        elements.scrollArrow.textContent = "-";
        elements.scrollCount.textContent = "";
        currentScrollCount = 0;
    }

    function handleInput(data, els, keys, buttons, speed) {
        try {
            const event = JSON.parse(data);
            
            if (event.event_type === "key_pressed" || event.event_type === "key_released") {
                const keyName = keycodemap[event.keycode];
                if (keyName) {
                    const el = els.keyElements.get(keyName);
                    if (el) {
                        if (event.event_type === "key_pressed") {
                            el.classList.add("active");
                            keys.add(keyName);
                        } else {
                            el.classList.remove("active");
                            keys.delete(keyName);
                        }
                    }
                }
            }
            else if (event.event_type === "mouse_pressed" || event.event_type === "mouse_released") {
                const btnName = mousebuttonmap[event.button];
                if (btnName) {
                    const el = els.mouseElements.get(btnName);
                    if (el) {
                        if (event.event_type === "mouse_pressed") {
                            el.classList.add("active");
                            buttons.add(btnName);
                        } else {
                            el.classList.remove("active");
                            buttons.delete(btnName);
                        }
                    }
                }
            }
            else if (event.event_type === "mouse_wheel") {
                const dir = event.rotation;
                if (lastScrollDirection !== null && lastScrollDirection !== dir) {
                    currentScrollCount = 0;
                }
                lastScrollDirection = dir;
                currentScrollCount++;

                els.scrollArrow.textContent = dir === -1 ? "↑" : "↓";
                
                requestAnimationFrame(() => {
                    els.scrollCount.textContent = currentScrollCount + "x";
                    els.scrollCount.classList.remove("animate");
                    void els.scrollCount.offsetWidth;
                    els.scrollCount.classList.add("animate");
                    els.scrollDisplay.classList.add("active");
                });

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    els.scrollArrow.textContent = "-";
                    els.scrollCount.textContent = "";
                    els.scrollDisplay.classList.remove("active");
                    lastScrollDirection = null;
                    currentScrollCount = 0;
                }, 150 * (100 / parseInt(speed)));
            }
        } catch (err) {
            console.error("parse error", err);
        }
    }

    connect();
}