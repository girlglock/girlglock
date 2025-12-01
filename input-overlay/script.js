const RAW_CODE_TO_KEY_NAME = {
    27: "key_escape", 49: "key_1", 50: "key_2", 51: "key_3", 52: "key_4", 53: "key_5", 54: "key_6", 55: "key_7", 56: "key_8", 57: "key_9", 48: "key_0", 189: "key_minus", 187: "key_equals", 8: "key_backspace",
    112: "key_f1", 113: "key_f2", 114: "key_f3", 115: "key_f4", 116: "key_f5", 117: "key_f6", 118: "key_f7", 119: "key_f8", 120: "key_f9", 121: "key_f10", 122: "key_f11", 123: "key_f12", 44: "key_printscreen", 145: "key_scrolllock", 19: "key_pause",
    45: "key_insert", 46: "key_delete", 36: "key_home", 35: "key_end", 33: "key_pageup", 34: "key_pagedown",
    9: "key_tab", 81: "key_q", 87: "key_w", 69: "key_e", 82: "key_r", 84: "key_t", 89: "key_y", 85: "key_u", 73: "key_i", 79: "key_o", 80: "key_p", 219: "key_openbracket", 221: "key_closebracket", 220: "key_backslash",
    20: "key_capslock", 65: "key_a", 83: "key_s", 68: "key_d", 70: "key_f", 71: "key_g", 72: "key_h", 74: "key_j", 75: "key_k", 76: "key_l", 186: "key_semicolon", 222: "key_apostrophe", 13: "key_enter",
    160: "key_leftshift", 90: "key_z", 88: "key_x", 67: "key_c", 86: "key_v", 66: "key_b", 78: "key_n", 77: "key_m", 188: "key_comma", 190: "key_period", 191: "key_slash", 161: "key_rightshift",
    162: "key_leftctrl", 91: "key_leftwin", 164: "key_leftalt", 32: "key_space", 165: "key_rightalt", 92: "key_rightwin", 93: "key_menu", 163: "key_rightctrl",
    37: "key_leftarrow", 38: "key_uparrow", 39: "key_rightarrow", 40: "key_downarrow",
    144: "key_numlock", 111: "key_numpad_divide", 106: "key_numpad_multiply", 109: "key_numpad_subtract",
    103: "key_numpad_7", 104: "key_numpad_8", 105: "key_numpad_9", 107: "key_numpad_add",
    100: "key_numpad_4", 101: "key_numpad_5", 102: "key_numpad_6",
    97: "key_numpad_1", 98: "key_numpad_2", 99: "key_numpad_3", 108: "key_numpad_enter",
    96: "key_numpad_0", 110: "key_numpad_decimal"
};

const BROWSER_CODE_TO_KEY_NAME = {
    "escape": "key_escape", "digit1": "key_1", "digit2": "key_2", "digit3": "key_3", "digit4": "key_4", "digit5": "key_5", "digit6": "key_6", "digit7": "key_7", "digit8": "key_8", "digit9": "key_9", "digit0": "key_0", "minus": "key_minus", "equal": "key_equals", "backspace": "key_backspace",
    "f1": "key_f1", "f2": "key_f2", "f3": "key_f3", "f4": "key_f4", "f5": "key_f5", "f6": "key_f6", "f7": "key_f7", "f8": "key_f8", "f9": "key_f9", "f10": "key_f10", "f11": "key_f11", "f12": "key_f12", "printscreen": "key_printscreen", "scrolllock": "key_scrolllock", "pause": "key_pause",
    "insert": "key_insert", "delete": "key_delete", "home": "key_home", "end": "key_end", "pageup": "key_pageup", "pagedown": "key_pagedown",
    "tab": "key_tab", "keyq": "key_q", "keyw": "key_w", "keye": "key_e", "keyr": "key_r", "keyt": "key_t", "keyy": "key_y", "keyu": "key_u", "keyi": "key_i", "keyo": "key_o", "keyp": "key_p", "bracketleft": "key_openbracket", "bracketright": "key_closebracket", "backslash": "key_backslash",
    "capslock": "key_capslock", "keya": "key_a", "keys": "key_s", "keyd": "key_d", "keyf": "key_f", "keyg": "key_g", "keyh": "key_h", "keyj": "key_j", "keyk": "key_k", "keyl": "key_l", "semicolon": "key_semicolon", "quote": "key_apostrophe", "enter": "key_enter",
    "shiftleft": "key_leftshift", "keyz": "key_z", "keyx": "key_x", "keyc": "key_c", "keyv": "key_v", "keyb": "key_b", "keyn": "key_n", "keym": "key_m", "comma": "key_comma", "period": "key_period", "slash": "key_slash", "shiftright": "key_rightshift",
    "controlleft": "key_leftctrl", "metaleft": "key_leftwin", "altleft": "key_leftalt", "space": "key_space", "altright": "key_rightalt", "metaright": "key_rightwin", "contextmenu": "key_menu", "controlright": "key_rightctrl",
    "arrowleft": "key_leftarrow", "arrowup": "key_uparrow", "arrowright": "key_rightarrow", "arrowdown": "key_downarrow",
    "numlock": "key_numlock", "numpaddivide": "key_numpad_divide", "numpadmultiply": "key_numpad_multiply", "numpadsubtract": "key_numpad_subtract",
    "numpad7": "key_numpad_7", "numpad8": "key_numpad_8", "numpad9": "key_numpad_9", "numpadadd": "key_numpad_add",
    "numpad4": "key_numpad_4", "numpad5": "key_numpad_5", "numpad6": "key_numpad_6",
    "numpad1": "key_numpad_1", "numpad2": "key_numpad_2", "numpad3": "key_numpad_3", "numpadenter": "key_numpad_enter",
    "numpad0": "key_numpad_0", "numpaddecimal": "key_numpad_decimal"
};

const MOUSE_BUTTON_MAP = {
    1: "mouse_left",
    2: "mouse_right",
    3: "mouse_middle",
    4: "mouse4",
    5: "mouse5"
};

const BROWSER_BUTTON_TO_KEY_NAME = {
    0: "mouse_left",
    1: "mouse_middle",
    2: "mouse_right",
    3: "mouse4",
    4: "mouse5"
};

const DEFAULT_LAYOUT_STRINGS = {
    row1: "key_escape:\"ESC\":invisible, key_1:\"1\", key_2:\"2\", key_3:\"3\", key_4:\"4\"",
    row2: "key_tab:\"TAB\":w-1-5u, key_q:\"Q\", key_w:\"W\", key_e:\"E\", key_r:\"R\"",
    row3: "key_leftshift:\"SHIFT\":w-2u, key_a:\"A\", key_s:\"S\", key_d:\"D\", key_f:\"F\"",
    row4: "",
    row5: "key_leftctrl:\"CTRL\":w-1-5u, key_leftalt:\"ALT\":w-1-5u, key_space:\"SPACE\":super-wide",
    mouse: "mouse_left:\"M1\":mouse-wide, scroller:\"M3\":\"🡅\":\"🡇\", mouse_right:\"M2\":mouse-wide"
};

const COLOR_PICKERS = [
    { id: "activecolor", defaultColor: "#8b5cf6" },
    { id: "backgroundcolor", defaultColor: "#1a1a1a" },
    { id: "activebgcolor", defaultColor: "#202020" },
    { id: "outlinecolor", defaultColor: "#4f4f4f" },
    { id: "fontcolor", defaultColor: "#ffffff" },
    { id: "inactivecolor", defaultColor: "#808080" }
];

let Z_INDEX_COUNTER = 100;
let KEY_RELEASE_TIMERS = {};

class InputOverlay {
    constructor() {
        this.previewElements = null;
        this.activeKeys = new Set();
        this.activeMouseButtons = new Set();
        this.currentScrollCount = 0;
        this.lastScrollDirection = null;
        this.scrollTimeout = null;
        this.urlParams = new URLSearchParams(window.location.search);
        this.isOverlayMode = this.urlParams.has("ws");

        if (this.isOverlayMode) {
            this.initOverlayMode();
        } else {
            this.initConfiguratorMode();
        }
    }

    hexToRgba(hex, alpha = 1) {
        if (!hex || !hex.startsWith("#")) return `rgba(0, 0, 0, ${alpha})`;
        hex = hex.toLowerCase();

        if (hex.length === 9) {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            const a = parseInt(hex.substring(7, 9), 16) / 255;
            return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
        }

        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateElementState(el, keyName, isActive, activeSet) {
        if (isActive) {
            if (!activeSet.has(keyName)) {
                el.classList.add("active");
                activeSet.add(keyName);
                Z_INDEX_COUNTER++;
                el.style.zIndex = Z_INDEX_COUNTER;
            }
        } else {
            el.classList.remove("active");
            activeSet.delete(keyName);
        }
    }

    getCurrentSettings() {
        return {
            wsaddress: document.getElementById("wsaddress").value || "localhost",
            wsport: document.getElementById("wsport").value || "16899",
            activecolor: document.getElementById("activecolorhex").value,
            inactivecolor: document.getElementById("inactivecolorhex").value,
            backgroundcolor: document.getElementById("backgroundcolorhex").value,
            activebgcolor: document.getElementById("activebgcolorhex").value,
            outlinecolor: document.getElementById("outlinecolorhex").value,
            fontcolor: document.getElementById("fontcolorhex").value,
            glowradius: document.getElementById("glowradius").value,
            borderradius: document.getElementById("borderradius").value,
            pressscale: document.getElementById("pressscale").value,
            animationspeed: document.getElementById("animationspeed").value,
            scale: document.getElementById("scale").value,
            opacity: document.getElementById("opacity").value,
            fontfamily: document.getElementById("fontfamily").value,
            hidemouse: document.getElementById("hidemouse").checked,
            hidescrollcombo: document.getElementById("hidescrollcombo").checked,

            customLayoutRow1: document.getElementById("customLayoutRow1") ? document.getElementById("customLayoutRow1").value : "",
            customLayoutRow2: document.getElementById("customLayoutRow2") ? document.getElementById("customLayoutRow2").value : "",
            customLayoutRow3: document.getElementById("customLayoutRow3") ? document.getElementById("customLayoutRow3").value : "",
            customLayoutRow4: document.getElementById("customLayoutRow4") ? document.getElementById("customLayoutRow4").value : "",
            customLayoutRow5: document.getElementById("customLayoutRow5") ? document.getElementById("customLayoutRow5").value : "",
            customLayoutMouse: document.getElementById("customLayoutMouse") ? document.getElementById("customLayoutMouse").value : "",
        };
    }

    updateState() {
        const settings = this.getCurrentSettings();
        this.applyStyles(settings);

        const layouts = {
            keyboard: this.getKeyboardLayoutDef(settings),
            mouse: this.getMouseLayoutDef(settings)
        };

        this.rebuildPreviewInterface(layouts);
        this.restoreActiveStates();
        this.applyContainerTransformations(settings);
        this.updateGeneratedLink(settings);
        this.adjustScrollDisplays();
        this.adjustKeyFontSizes();
    }

    applyStyles(opts) {
        const pressscalevalue = parseInt(opts.pressscale) / 100;
        const animDuration = (0.15 * (100 / parseInt(opts.animationspeed))) + "s";

        const activeColorRgb = this.hexToRgba(opts.activecolor, 1);
        const activeColorForGradient = activeColorRgb.replace(/, [\d\.]+?\)/, ', 0.3)');

        this.applyFontStyles(opts.fontfamily);

        let styleEl = document.getElementById("dynamic-styles");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "dynamic-styles";
            document.head.appendChild(styleEl);
        }

        const css = `
            :root {
                --active-color: ${opts.activecolor};
            }
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
                background: ${opts.activebgcolor} !important;
            }
            .key.active::before, .mouse-btn.active::before, .scroll-display.active::before {
                background: linear-gradient(135deg, ${activeColorForGradient}, ${activeColorForGradient}) !important;
            }

            .mouse-btn.mouse-side {
                padding: 5px;
            }
            .mouse-btn.mouse-side span {
                background: ${opts.backgroundcolor} !important;
                border-color: ${opts.outlinecolor} !important;
                color: ${opts.inactivecolor} !important;
                width: 18px !important;
                transition: all ${animDuration} cubic-bezier(0.4,0,0.2,1) !important;
            }
            .mouse-btn.mouse-side span.active {
                border-color: ${opts.activecolor} !important;
                box-shadow: 0 0 ${opts.glowradius}px ${opts.activecolor} !important;
                color: ${opts.fontcolor} !important;
                background: ${opts.activebgcolor} !important;
                transform: scale(${pressscalevalue}) !important;
            }
            
            .scroll-count {
                color: ${opts.fontcolor} !important;
                display: ${opts.hidescrollcombo ? "none" : "flex"} !important;
            }
            .mouse-section {
                display: ${opts.hidemouse ? "none" : "flex"} !important;
            }
        `;

        styleEl.textContent = css;
    }

    applyFontStyles(fontfamily) {
        if (fontfamily) {
            const link = document.createElement("link");
            const fontName = fontfamily.toLowerCase().replace(/ /g, "+");
            link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
            link.rel = "stylesheet";

            document.head.querySelectorAll("link[href*='fonts.googleapis']").forEach(el => el.remove());

            if (fontName !== "") {
                document.head.appendChild(link);
                document.body.style.fontFamily = `"${fontfamily}", sans-serif`;
            } else {
                document.body.style.fontFamily = "";
            }
        } else {
            document.head.querySelectorAll("link[href*='fonts.googleapis']").forEach(el => el.remove());
            document.body.style.fontFamily = "";
        }
    }

    applyTransformations(targetElement, settings) {
        const scaleVal = parseInt(settings.scale) / 100;
        const opacityVal = parseInt(settings.opacity) / 100;

        targetElement.style.transform = `scale(${scaleVal})`;
        targetElement.style.opacity = opacityVal;
        targetElement.style.transformOrigin = this.isOverlayMode ? "top left" : "center";
    }

    applyContainerTransformations(settings) {
        const previewContainer = document.querySelector(".preview-container");
        if (previewContainer) {
            this.applyTransformations(previewContainer, settings);
        }
    }

    parseKeyDef(keyString) {
        if (!keyString) return null;

        if (keyString === "invisible" || keyString === "dummy")
            return { class: "dummy" };

        const parts = keyString.match(/^(\w+):"([^"]+)"(?::([-\w\.]+))?$/);

        if (parts) {
            const keyDef = { key: parts[1], label: parts[2] };
            if (parts[3]) {
                keyDef.class = parts[3];
            } else if (keyDef.label === "invisible") {
                keyDef.class = "invisible";
            }
            return keyDef;
        }
        return null;
    }

    parseMouseDef(mouseString) {
        if (!mouseString) return null;

        const standardMatch = mouseString.match(/^(\w+):"([^"]+)"(?::([-\w]+))?$/);
        if (standardMatch) {
            return {
                key: standardMatch[1],
                labels: [standardMatch[2]],
                class: standardMatch[3] || 'mouse-btn'
            };
        }

        const scrollerMatch = mouseString.match(/^(scroller):"([^"]+)":"([^"]+)":"([^"]+)"$/);
        if (scrollerMatch) {
            return {
                key: scrollerMatch[1],
                labels: [scrollerMatch[2], scrollerMatch[3], scrollerMatch[4]],
                class: 'scroll-display'
            };
        }

        const sideMatch = mouseString.match(/^(mouse_side):"([^"]+)":"([^"]+)"$/);
        if (sideMatch) {
            return {
                key: sideMatch[1],
                labels: [sideMatch[2], sideMatch[3]],
                class: 'mouse-side'
            };
        }

        return null;
    }

    parseCustomLayoutInput(inputString, isMouseLayout = false) {
        if (!inputString) return [];

        const parser = isMouseLayout ? this.parseMouseDef : this.parseKeyDef;

        return inputString.split(/\s*,\s*/)
            .map(parser.bind(this))
            .filter(def => def !== null);
    }

    getKeyboardLayoutDef(settings) {
        const customLayout = [];

        const row1 = this.parseCustomLayoutInput(settings.customLayoutRow1);
        const row2 = this.parseCustomLayoutInput(settings.customLayoutRow2);
        const row3 = this.parseCustomLayoutInput(settings.customLayoutRow3);
        const row4 = this.parseCustomLayoutInput(settings.customLayoutRow4);
        const row5 = this.parseCustomLayoutInput(settings.customLayoutRow5);

        if (row1.length > 0) customLayout.push(row1);
        if (row2.length > 0) customLayout.push(row2);
        if (row3.length > 0) customLayout.push(row3);
        if (row4.length > 0) customLayout.push(row4);
        if (row5.length > 0) customLayout.push(row5);

        if (customLayout.length > 0) {
            return customLayout;
        }

        const defaultLayoutFallback = [
            this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.row1),
            this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.row2),
            this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.row3),
            this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.row4),
            this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.row5)
        ].filter(row => row.length > 0);

        return defaultLayoutFallback;
    }

    getMouseLayoutDef(settings) {
        const customLayout = this.parseCustomLayoutInput(settings.customLayoutMouse, true);
        if (customLayout.length > 0) {
            return customLayout;
        }
        return this.parseCustomLayoutInput(DEFAULT_LAYOUT_STRINGS.mouse, true);
    }

    createKeyOrButtonElement(baseClass, keyName, label, customClass) {
        const el = document.createElement("div");
        el.className = baseClass + (customClass ? " " + customClass : "");
        el.textContent = label;
        el.dataset.key = keyName;
        return el;
    }

    createScrollDisplay(labels) {
        const scrollDisplay = document.createElement("div");
        scrollDisplay.className = "scroll-display";
        scrollDisplay.id = "scrolldisplay";
        scrollDisplay.dataset.button = "mouse_middle";

        const scrollArrow = document.createElement("span");
        scrollArrow.className = "scroll-arrow";
        scrollArrow.textContent = labels[0];

        const scrollCount = document.createElement("span");
        scrollCount.className = "scroll-count";

        scrollDisplay.appendChild(scrollArrow);
        scrollDisplay.appendChild(scrollCount);

        scrollDisplay.dataset.defaultLabel = labels[0];
        scrollDisplay.dataset.upLabel = labels[1];
        scrollDisplay.dataset.downLabel = labels[2];

        return { el: scrollDisplay, arrow: scrollArrow, count: scrollCount };
    }

    createSideMouseButton(labelM4, labelM5, customClass) {
        const el = document.createElement("div");
        el.className = 'mouse-btn mouse-side' + (customClass ? " " + customClass : "");

        const m4El = document.createElement("span");
        m4El.textContent = labelM4;
        m4El.dataset.key = "mouse4";

        const m5El = document.createElement("span");
        m5El.textContent = labelM5;
        m5El.dataset.key = "mouse5";
        el.appendChild(m5El);
        el.appendChild(m4El);

        return { el, m4El, m5El };
    }

    buildInterface(keyboardContainer, mouseContainer, layoutDef, mouseLayoutDef) {
        if (!keyboardContainer || !mouseContainer || !layoutDef) return null;

        keyboardContainer.innerHTML = "";
        mouseContainer.innerHTML = "";

        const keyElements = new Map();
        const mouseElements = new Map();
        let scrollDisplay = null;
        let scrollArrow = null;
        let scrollCount = null;

        layoutDef.forEach(row => {
            const rowEl = document.createElement("div");
            rowEl.className = "key-row";
            row.forEach(item => {
                const keyEl = this.createKeyOrButtonElement("key", item.key, item.label, item.class);
                rowEl.appendChild(keyEl);
                if (!item.class || item.class !== "invisible") {
                    keyElements.set(item.key, keyEl);
                }
            });
            keyboardContainer.appendChild(rowEl);
        });

        const mouseRow = document.createElement("div");
        mouseRow.className = "mouse-row";

        mouseLayoutDef.forEach(item => {
            if (item.key === 'scroller') {
                const display = this.createScrollDisplay(item.labels);
                mouseRow.appendChild(display.el);
                scrollDisplay = display.el;
                scrollArrow = display.arrow;
                scrollCount = display.count;
                mouseElements.set("mouse_middle", display.el);
            } else if (item.key === 'mouse_side') {
                const sideBtn = this.createSideMouseButton(item.labels[0], item.labels[1], item.class);
                mouseRow.appendChild(sideBtn.el);
                mouseElements.set("mouse5", sideBtn.m5El);
                mouseElements.set("mouse4", sideBtn.m4El);
            } else {
                const btnEl = this.createKeyOrButtonElement("mouse-btn", item.key, item.labels[0], item.class);
                mouseRow.appendChild(btnEl);
                mouseElements.set(item.key, btnEl);
            }
        });

        const mouseSection = document.createElement("div");
        mouseSection.className = "mouse-section";
        mouseSection.appendChild(mouseRow);
        mouseContainer.appendChild(mouseSection);

        return { keyElements, mouseElements, scrollDisplay, scrollArrow, scrollCount };
    }

    rebuildPreviewInterface(layouts) {
        const previewKeys = document.getElementById("preview-keyboard");
        const previewMouse = document.getElementById("preview-mouse");

        this.previewElements = this.buildInterface(
            previewKeys,
            previewMouse,
            layouts.keyboard,
            layouts.mouse
        );
    }

    restoreActiveStates() {
        const oldActiveKeys = new Set(this.activeKeys);
        const oldActiveMouseButtons = new Set(this.activeMouseButtons);

        this.restoreActiveElements(oldActiveKeys, this.previewElements.keyElements, this.activeKeys);
        this.restoreActiveElements(oldActiveMouseButtons, this.previewElements.mouseElements, this.activeMouseButtons);
    }

    restoreActiveElements(oldActive, elementMap, currentActive) {
        oldActive.forEach(name => {
            const el = elementMap.get(name);
            if (el) {
                el.style.zIndex = Z_INDEX_COUNTER++;
                this.updateElementState(el, name, true, currentActive);
            }
        });
    }

    adjustScrollDisplays() {
        document.querySelectorAll('.scroll-display').forEach(display => {
            const arrow = display.querySelector('.scroll-arrow');
            const count = display.querySelector('.scroll-count');

            arrow.style.transform = 'none';
            count.textContent = "";
            display.classList.remove("active");
            this.lastScrollDirection = null;
            this.currentScrollCount = 0;

            const defaultLabel = display.dataset.defaultLabel || "-";
            arrow.textContent = defaultLabel;

            const containerWidth = display.clientWidth - 16;
            const textWidth = this.measureTextWidth(arrow);

            let finalScale = 1.1;
            if (textWidth * finalScale > containerWidth) {
                finalScale = containerWidth / textWidth;
            }
            arrow.style.transform = `scale(${finalScale})`;
        });
    }

    adjustKeyFontSizes() {
        document.querySelectorAll('.key').forEach(key => {
            key.style.fontSize = '';
            const textWidth = this.measureTextWidth(key);
            const containerWidth = key.clientWidth - 24;

            if (textWidth > containerWidth) {
                this.scaleKeyFontSize(key, containerWidth, textWidth);
            }
        });
    }

    measureTextWidth(element) {
        const tempSpan = document.createElement('span');
        const styles = window.getComputedStyle(element);

        tempSpan.style.cssText = 'position: absolute; visibility: hidden; white-space: nowrap;';
        tempSpan.style.fontSize = styles.fontSize;
        tempSpan.style.fontWeight = styles.fontWeight;
        tempSpan.style.fontFamily = styles.fontFamily;
        tempSpan.textContent = element.textContent;

        document.body.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        return width;
    }

    scaleKeyFontSize(element, containerWidth, textWidth) {
        const currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);
        const scaleFactor = containerWidth / textWidth;
        const newFontSize = currentFontSize * scaleFactor;
        element.style.fontSize = `${newFontSize}px`;
    }

    setupBackgroundVideo() {
        const video = document.getElementById("bgvideo");
        const source = document.getElementById("bgsource");

        if (video && source) {
            const randomIndex = Math.floor(Math.random() * 2) + 1;
            const path = `./media/preview_gameplay${randomIndex}.mp4`;

            source.src = path;
            video.load();
            video.play();
        }
    }

    setupCheatSheetToggle() {
        const allDetails = document.querySelectorAll('.fullscreen-details');

        allDetails.forEach(detailsTag => {
            const closeBtn = detailsTag.querySelector('.close-btn');
            if (!closeBtn) return;

            closeBtn.addEventListener('click', e => {
                e.preventDefault();
                detailsTag.open = false;
            });

            const updateCloseButtonVisibility = () => {
                closeBtn.style.display = detailsTag.open ? 'inline' : 'none';
            };

            updateCloseButtonVisibility();
            detailsTag.addEventListener('toggle', updateCloseButtonVisibility);
        });
    }

    initConfiguratorMode() {
        document.getElementById("configurator").style.display = "block";
        document.getElementById("overlay").classList.remove("show");

        const previewKeys = document.getElementById("preview-keyboard");
        const previewMouse = document.getElementById("preview-mouse");

        document.getElementById("customLayoutRow1").value = document.getElementById("customLayoutRow1").value || DEFAULT_LAYOUT_STRINGS.row1;
        document.getElementById("customLayoutRow2").value = document.getElementById("customLayoutRow2").value || DEFAULT_LAYOUT_STRINGS.row2;
        document.getElementById("customLayoutRow3").value = document.getElementById("customLayoutRow3").value || DEFAULT_LAYOUT_STRINGS.row3;
        document.getElementById("customLayoutRow4").value = document.getElementById("customLayoutRow4").value || DEFAULT_LAYOUT_STRINGS.row4;
        document.getElementById("customLayoutRow5").value = document.getElementById("customLayoutRow5").value || DEFAULT_LAYOUT_STRINGS.row5;

        const customLayoutMouseInput = document.getElementById("customLayoutMouse");
        customLayoutMouseInput.value = customLayoutMouseInput.value || DEFAULT_LAYOUT_STRINGS.mouse;


        const settings = this.getCurrentSettings();
        const keyboardLayout = this.getKeyboardLayoutDef(settings);
        const mouseLayout = this.getMouseLayoutDef(settings);
        this.previewElements = this.buildInterface(previewKeys, previewMouse, keyboardLayout, mouseLayout);

        COLOR_PICKERS.forEach(cp => {
            this.initPickrColorInput(cp.id, cp.defaultColor);
        });

        this.setupConfigInputs();
        this.setupPreviewInputListeners();

        this.setupBackgroundVideo();
        this.setupCheatSheetToggle();
        this.loadSettingsFromLink(true);

        this.updateState();
    }

    initPickrColorInput(pickrId, defaultColor) {
        const pickrEl = document.getElementById(pickrId);
        const hexInput = document.getElementById(pickrId + "hex");

        if (!pickrEl || !hexInput) return;

        const pickr = Pickr.create({
            el: pickrEl,
            theme: "classic",
            default: hexInput.value || defaultColor,
            components: {
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsva: true,
                    input: true,
                    clear: false,
                    save: true
                }
            },
            strings: {
                save: "Apply"
            },
            swatches: []
        });

        pickr.on("change", (color) => {
            const hexA = color.toHEXA().toString();
            hexInput.value = hexA.toLowerCase();
            pickr.applyColor();
            this.updateState();
        });

        hexInput.addEventListener("input", (e) => {
            let val = e.target.value.toLowerCase().replace(/[^0-9a-f#]/g, "");
            if (!val.startsWith("#")) val = "#" + val;
            if (val.length > 9) val = val.substring(0, 9);
            e.target.value = val;

            if (val.length === 7 || val.length === 9) {
                try {
                    pickr.setColor(val, true);
                } catch (error) { }
                this.updateState();
            }
        });

        try {
            pickr.setColor(hexInput.value || defaultColor, true);
        } catch (error) { }
    }

    setupConfigInputs() {
        const inputs = document.querySelectorAll(".config-input");
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                if (input.type === "range") {
                    const label = document.getElementById(input.id + "value");
                    if (label) {
                        let suffix = "";
                        if (input.id.includes("radius")) suffix = "px";
                        else if (input.id.includes("scale")) suffix = "x";
                        else if (input.id === "opacity" || input.id.includes("speed")) suffix = "%";

                        let val = input.value;
                        if (input.id.includes("scale") && !input.id.includes("pressscale")) val = (val / 100).toFixed(1);
                        else if (input.id === "pressscale") val = (val / 100).toFixed(2);

                        label.textContent = val + suffix;
                    }
                } else if (input.classList.contains("color-hex-input")) {
                    return;
                }
                this.updateState();
            });
        });
        document.getElementById("copybtn").addEventListener("click", this.copyLink.bind(this));
        document.getElementById("loadbtn").addEventListener("click", this.loadSettingsFromLink.bind(this));
    }

    setupPreviewInputListeners() {
        document.addEventListener("keydown", e => this.handlePreviewInput(e, "key_pressed"), { capture: true });
        document.addEventListener("keyup", e => this.handlePreviewInput(e, "key_released"), { capture: true });
        document.addEventListener("mousedown", e => this.handlePreviewInput(e, "mouse_pressed"));
        document.addEventListener("mouseup", e => this.handlePreviewInput(e, "mouse_released"));
        document.addEventListener("wheel", e => this.handlePreviewInput(e, "mouse_wheel"), { passive: true });
    }

    handlePreviewInput(event, type) {
        if (!this.previewElements) return;

        const isTypingField = event.target.matches("input[type='text'], input[type='number'], textarea, .color-hex-input");

        if (type === "key_pressed" || type === "key_released") {
            let keyName = BROWSER_CODE_TO_KEY_NAME[event.code.toLowerCase()];
            let el = this.previewElements.keyElements.get(keyName);

            if (!el && event.key) {
                const keyLabel = event.key.toUpperCase();
                for (const [key, element] of this.previewElements.keyElements.entries()) {
                    if (element.textContent === keyLabel) {
                        keyName = key;
                        el = element;
                        break;
                    }
                }
            }

            if (el) {
                this.updateElementState(el, keyName, type === "key_pressed", this.activeKeys);

                if (!isTypingField) {
                    event.preventDefault();
                } else if (keyName === "key_tab" || keyName === "key_escape") {
                    event.preventDefault();
                }
            }
        }
        else if (type === "mouse_pressed" || type === "mouse_released") {
            const btnName = BROWSER_BUTTON_TO_KEY_NAME[event.button];
            if (btnName) {
                const el = this.previewElements.mouseElements.get(btnName);
                if (el) {
                    this.updateElementState(el, btnName, type === "mouse_pressed", this.activeMouseButtons);
                }
            }
        }
        else if (type === "mouse_wheel") {
            const dir = Math.sign(event.deltaY);
            if (this.previewElements.scrollDisplay) {
                this.handleScroll(dir);
            }
        }
    }

    updateGeneratedLink(settings) {
        const params = this.buildURLParams(settings);
        const baseURL = `${window.location.origin}${window.location.pathname}`;

        window.history.replaceState({}, "", `${baseURL}?${params}`);

        params.set("ws", `${settings.wsaddress}:${settings.wsport}`);
        const linkInput = document.getElementById("generatedlink");
        linkInput.value = `${baseURL}?${params}`;

        const container = linkInput.closest(".link-container") || document.querySelector(".link-container");
        container.classList.add("hint");
        setTimeout(() => container.classList.remove("hint"), 1000);
    }

    applySettings(settings) {
        if (!settings) return;

        const applyValue = (id, value) => {
            const el = document.getElementById(id);
            if (el && value !== undefined) {
                if (el.type === 'checkbox') {
                    el.checked = value === 'true' || value === '1' || value === true; //force gh actions grr
                } else {
                    el.value = value;
                    if (id.includes('colorhex')) {
                        const pickrTargetId = id.replace('hex', '');
                        const pickrTarget = document.getElementById(pickrTargetId);
                        if (pickrTarget && pickrTarget._pickr) {
                            pickrTarget._pickr.setColor(value);
                        }
                    }
                }
                if (el.type === 'range') {
                    el.dispatchEvent(new Event('input'));
                }
            }
        };

        applyValue("wsaddress", settings.wsaddress);
        applyValue("wsport", settings.wsport);
        applyValue("activecolorhex", settings.activecolor);
        applyValue("inactivecolorhex", settings.inactivecolor);
        applyValue("backgroundcolorhex", settings.backgroundcolor);
        applyValue("activebgcolorhex", settings.activebgcolor);
        applyValue("outlinecolorhex", settings.outlinecolor);
        applyValue("fontcolorhex", settings.fontcolor);
        applyValue("glowradius", settings.glowradius);
        applyValue("borderradius", settings.borderradius);
        applyValue("pressscale", settings.pressscale);
        applyValue("animationspeed", settings.animationspeed);
        applyValue("scale", settings.scale);
        applyValue("opacity", settings.opacity);
        applyValue("fontfamily", settings.fontfamily);
        applyValue("hidemouse", settings.hidemouse);
        applyValue("hidescrollcombo", settings.hidescrollcombo);
        applyValue("customLayoutRow1", settings.customLayoutRow1);
        applyValue("customLayoutRow2", settings.customLayoutRow2);
        applyValue("customLayoutRow3", settings.customLayoutRow3);
        applyValue("customLayoutRow4", settings.customLayoutRow4);
        applyValue("customLayoutRow5", settings.customLayoutRow5);
        applyValue("customLayoutMouse", settings.customLayoutMouse);
    }

    loadSettingsFromLink(fromCurrentUrl = false) {
        const linkInput = document.getElementById("generatedlink");
        const loadBtn = document.getElementById("loadbtn");

        let urlString = fromCurrentUrl
            ? window.location.href
            : linkInput.value;

        if (!urlString || urlString.trim() === "") {
            console.warn("Link field is empty. Cannot load settings.");
            loadBtn.textContent = "empty";
            loadBtn.classList.add("copied");
            setTimeout(() => {
                loadBtn.textContent = "load";
                loadBtn.classList.remove("copied");
            }, 2000);
            return;
        }

        if (!urlString.startsWith('http')) {
            urlString = window.location.origin + urlString;
        }

        try {
            const url = new URL(urlString);
            const params = url.searchParams;
            const settings = {};

            for (const key of params.keys()) {
                const value = params.get(key);
                if (key !== 'ws' && value !== null && value !== "") {
                    settings[key] = value;
                }
            }

            if (Object.keys(settings).length > 0) {
                this.applySettings(settings);
                this.updateState();

                loadBtn.textContent = "loaded";
                loadBtn.classList.add("copied");
                setTimeout(() => {
                    loadBtn.textContent = "load";
                    loadBtn.classList.remove("copied");
                }, 2000);
            } else {
                console.warn("No settings found in the link's query parameters.");
                loadBtn.textContent = "no params";
                loadBtn.classList.add("copied");
                setTimeout(() => {
                    loadBtn.textContent = "load";
                    loadBtn.classList.remove("copied");
                }, 2000);
            }

        } catch (e) {
            console.error("Invalid URL format:", e);
            loadBtn.textContent = "error";
            loadBtn.classList.add("copied");
            setTimeout(() => {
                loadBtn.textContent = "load";
                loadBtn.classList.remove("copied");
            }, 2000);
        }
    }


    buildURLParams(settings) {
        const params = new URLSearchParams();

        const colorSettings = {
            activecolor: settings.activecolor,
            inactivecolor: settings.inactivecolor,
            backgroundcolor: settings.backgroundcolor,
            activebgcolor: settings.activebgcolor,
            outlinecolor: settings.outlinecolor,
            fontcolor: settings.fontcolor
        };

        Object.entries(colorSettings).forEach(([key, value]) => {
            params.set(key, value.toLowerCase());
        });

        params.set("glow", settings.glowradius);
        params.set("radius", settings.borderradius);
        params.set("pressscale", settings.pressscale);
        params.set("speed", settings.animationspeed);
        params.set("scale", settings.scale);
        params.set("opacity", settings.opacity);

        if (settings.fontfamily) {
            params.set("fontfamily", settings.fontfamily.toLowerCase());
        }

        if (settings.hidemouse) {
            params.set("hidemouse", "1");
        }

        if (settings.hidescrollcombo) {
            params.set("hidescrollcombo", "1");
        }

        this.addCustomLayoutParams(params, settings);

        return params;
    }

    addCustomLayoutParams(params, settings) {
        const layoutRows = [
            'customLayoutRow1', 'customLayoutRow2', 'customLayoutRow3', 'customLayoutRow4', 'customLayoutRow5', 'customLayoutMouse'
        ];
        layoutRows.forEach(row => {
            if (settings[row]) {
                params.set(row, settings[row]);
            }
        });
    }

    async copyLink() {
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

    handleScroll(dir) {
        const els = this.previewElements;
        if (dir === 0 || !els.scrollDisplay) return;

        if (this.lastScrollDirection !== null && this.lastScrollDirection !== dir) {
            this.currentScrollCount = 0;
        }
        this.lastScrollDirection = dir;
        this.currentScrollCount++;

        const upLabel = els.scrollDisplay.dataset.upLabel || "↑";
        const downLabel = els.scrollDisplay.dataset.downLabel || "↓";

        els.scrollArrow.textContent = dir === -1 ? upLabel : downLabel;

        const containerWidth = els.scrollDisplay.clientWidth - 16;
        els.scrollArrow.style.transform = 'none';
        const textWidth = els.scrollArrow.scrollWidth;

        let finalScaleActive = 1;

        if (textWidth > containerWidth) {
            finalScaleActive = containerWidth / textWidth;
        }

        els.scrollArrow.style.transform = `scale(${finalScaleActive})`;

        if (els.scrollDisplay.dataset.button !== "mouse_middle") {
            els.scrollDisplay.dataset.button = "mouse_middle";
        }

        requestAnimationFrame(() => {
            els.scrollCount.textContent = this.currentScrollCount + "x";
            els.scrollCount.classList.remove("animate");

            if (dir === -1) {
                els.scrollCount.classList.remove("scroll-down");
                els.scrollCount.classList.add("scroll-up");
            } else {
                els.scrollCount.classList.remove("scroll-up");
                els.scrollCount.classList.add("scroll-down");
            }

            void els.scrollCount.offsetWidth;
            els.scrollCount.classList.add("animate");

            if (!els.scrollDisplay.classList.contains("active")) {
                Z_INDEX_COUNTER++;
                els.scrollDisplay.style.zIndex = Z_INDEX_COUNTER;
            }

            els.scrollDisplay.classList.add("active");
        });

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.adjustScrollDisplays();
        }, 250);
    }

    initOverlayMode() {
        document.getElementById("configurator").style.display = "none";
        document.getElementById("overlay").classList.add("show");
        const statusEl = document.getElementById("status");

        const settings = this.getOverlaySettings();

        this.applyTransformations(document.body, settings);
        this.applyStyles(settings);

        const keyboardTarget = document.getElementById("keyboard-target");
        const mouseTarget = document.getElementById("mouse-target");
        const keyboardLayout = this.getKeyboardLayoutDef(settings);
        const mouseLayout = this.getMouseLayoutDef(settings);
        this.previewElements = this.buildInterface(keyboardTarget, mouseTarget, keyboardLayout, mouseLayout);

        const wsConfig = (this.urlParams.get("ws") || "").split(":");
        const wsAddress = wsConfig[0] || "localhost";
        const wsPort = wsConfig[1] || "16899";
        const wsUrl = `ws://${wsAddress}:${wsPort}/`;

        this.websocketManager = new WebSocketManager(wsUrl, statusEl, this.previewElements, this);
        this.websocketManager.connect();
        this.adjustScrollDisplays();
        this.adjustKeyFontSizes();
    }

    getOverlaySettings() {
        return {
            activecolor: this.urlParams.get("activecolor") || "#8b5cf6",
            inactivecolor: this.urlParams.get("inactivecolor") || "#808080",
            backgroundcolor: this.urlParams.get("backgroundcolor") || "#1a1a1a",
            activebgcolor: this.urlParams.get("activebgcolor") || "#202020",
            outlinecolor: this.urlParams.get("outlinecolor") || "#4f4f4f",
            fontcolor: this.urlParams.get("fontcolor") || "#ffffff",
            glowradius: this.urlParams.get("glow") || "24",
            borderradius: this.urlParams.get("radius") || "8",
            pressscale: this.urlParams.get("pressscale") || "105",
            animationspeed: this.urlParams.get("speed") || "100",
            scale: this.urlParams.get("scale") || "100",
            opacity: this.urlParams.get("opacity") || "100",
            fontfamily: this.urlParams.get("fontfamily") || "",
            hidemouse: this.urlParams.get("hidemouse") === "1",
            hidescrollcombo: this.urlParams.get("hidescrollcombo") === "1",

            customLayoutRow1: this.urlParams.get("customLayoutRow1") || DEFAULT_LAYOUT_STRINGS.row1,
            customLayoutRow2: this.urlParams.get("customLayoutRow2") || DEFAULT_LAYOUT_STRINGS.row2,
            customLayoutRow3: this.urlParams.get("customLayoutRow3") || DEFAULT_LAYOUT_STRINGS.row3,
            customLayoutRow4: this.urlParams.get("customLayoutRow4") || DEFAULT_LAYOUT_STRINGS.row4,
            customLayoutRow5: this.urlParams.get("customLayoutRow5") || DEFAULT_LAYOUT_STRINGS.row5,
            customLayoutMouse: this.urlParams.get("customLayoutMouse") || DEFAULT_LAYOUT_STRINGS.mouse,
        };
    }


}

class WebSocketManager {
    constructor(url, statusEl, elements, visualizer) {
        this.wsUrl = url;
        this.statusEl = statusEl;
        this.elements = elements;
        this.visualizer = visualizer;
        this.ws = null;
        this.connectionAttempts = 0;
    }

    connect() {
        this.connectionAttempts++;
        this.statusEl.textContent = `connecting to ${this.wsUrl} (attempt ${this.connectionAttempts})...`;
        this.statusEl.className = "status connecting";

        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onclose = this.onClose.bind(this);
    }

    onOpen() {
        this.connectionAttempts = 0;
        this.statusEl.textContent = "connected";
        this.statusEl.className = "status connected";
        this.clearStuckKeys();
    }

    onMessage(e) {
        this.handleOverlayInput(e.data);
    }

    onError() {
        this.statusEl.textContent = "connection failed";
        this.statusEl.className = "status error";
    }

    onClose() {
        this.statusEl.textContent = "disconnected. reconnecting...";
        this.statusEl.className = "status connecting";
        this.clearStuckKeys();
        setTimeout(() => this.connect(), 2000);
    }

    clearStuckKeys() {
        this.elements.keyElements.forEach(el => {
            el.classList.remove("active");
        });
        this.elements.mouseElements.forEach(el => {
            if (el.dataset.key === 'mouse4' || el.dataset.key === 'mouse5') {
                el.classList.remove("active");
            } else {
                el.classList.remove("active");
            }
        });
        this.visualizer.activeKeys.clear();
        this.visualizer.activeMouseButtons.clear();
        if (this.elements.scrollDisplay) {
            this.elements.scrollDisplay.classList.remove("active");
            this.elements.scrollArrow.textContent = this.elements.scrollDisplay.dataset.defaultLabel || "-";
            this.elements.scrollCount.textContent = "";
        }
        this.visualizer.currentScrollCount = 0;

        for (const key in KEY_RELEASE_TIMERS) {
            clearTimeout(KEY_RELEASE_TIMERS[key]);
        }
        KEY_RELEASE_TIMERS = {};
    }

    handleOverlayInput(data) {
        try {
            const event = JSON.parse(data);

            if (event.event_type === "key_pressed" || event.event_type === "key_released") {
                const keyName = RAW_CODE_TO_KEY_NAME[event.rawcode];
                if (keyName) {
                    const el = this.elements.keyElements.get(keyName);

                    if (el) {
                        if (event.event_type === "key_pressed") {
                            if (!this.visualizer.activeKeys.has(keyName)) {
                                this.visualizer.updateElementState(el, keyName, true, this.visualizer.activeKeys);
                            }
                        } else {
                            this.visualizer.updateElementState(el, keyName, false, this.visualizer.activeKeys);
                        }
                    }
                }
            }
            else if (event.event_type === "mouse_pressed" || event.event_type === "mouse_released") {
                const btnName = MOUSE_BUTTON_MAP[event.button];
                if (btnName) {
                    const el = this.elements.mouseElements.get(btnName);
                    if (el) {
                        if (event.event_type === "mouse_pressed") {
                            if (!this.visualizer.activeMouseButtons.has(btnName)) {
                                this.visualizer.updateElementState(el, btnName, true, this.visualizer.activeMouseButtons);
                            }
                        } else {
                            this.visualizer.updateElementState(el, btnName, false, this.visualizer.activeMouseButtons);
                        }
                    }
                }
            }
            else if (event.event_type === "mouse_wheel") {
                const dir = event.rotation;
                if (this.elements.scrollDisplay) {
                    this.visualizer.handleScroll(dir);
                }
            }
        } catch (err) {
            console.error("parse error", err);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InputOverlay();
});