["activecolor", "inactivecolor", "backgroundcolor", "outlinecolor", "fontcolor"].forEach(id => {
    const colorinput = document.getElementById(id);
    const textinput = document.getElementById(id + "text");
    if (colorinput && textinput) {
        colorinput.addEventListener("input", e => {
            textinput.value = e.target.value;
            updatecolorpreview();
        });
        textinput.addEventListener("input", e => {
            if (/^#[0-9a-f]{6}$/i.test(e.target.value)) {
                colorinput.value = e.target.value;
                updatecolorpreview();
            }
        });
    }
});

function updatecolorpreview() {
    const colors = [
        document.getElementById("activecolor")?.value,
        document.getElementById("inactivecolor")?.value,
        document.getElementById("backgroundcolor")?.value,
        document.getElementById("outlinecolor")?.value
    ];
    const samples = document.querySelectorAll(".color-sample");
    samples.forEach((sample, index) => {
        if (colors[index]) {
            sample.style.backgroundColor = colors[index];
        }
    });
}

updatecolorpreview();

const glowradiusel = document.getElementById("glowradius");
if (glowradiusel) {
    glowradiusel.addEventListener("input", e => {
        const valueel = document.getElementById("glowradiusvalue");
        if (valueel) valueel.textContent = e.target.value + "px";
    });
}

const borderradiusel = document.getElementById("borderradius");
if (borderradiusel) {
    borderradiusel.addEventListener("input", e => {
        const valueel = document.getElementById("borderradiusvalue");
        if (valueel) valueel.textContent = e.target.value + "px";
    });
}

const pressscaleel = document.getElementById("pressscale");
if (pressscaleel) {
    pressscaleel.addEventListener("input", e => {
        const value = (e.target.value / 100).toFixed(2);
        const valueel = document.getElementById("pressscalevalue");
        if (valueel) valueel.textContent = value + "x";
    });
}

const animationspeedel = document.getElementById("animationspeed");
if (animationspeedel) {
    animationspeedel.addEventListener("input", e => {
        const value = (e.target.value / 100).toFixed(1);
        const valueel = document.getElementById("animationspeedvalue");
        if (valueel) valueel.textContent = value + "x";
    });
}

const scaleel = document.getElementById("scale");
if (scaleel) {
    scaleel.addEventListener("input", e => {
        const value = (e.target.value / 100).toFixed(1);
        const valueel = document.getElementById("scalevalue");
        if (valueel) valueel.textContent = value + "x";
    });
}

const opacityel = document.getElementById("opacity");
if (opacityel) {
    opacityel.addEventListener("input", e => {
        const valueel = document.getElementById("opacityvalue");
        if (valueel) valueel.textContent = e.target.value + "%";
    });
}

const urlparams = new URLSearchParams(window.location.search);
const hasconfig = urlparams.has("ws");

if (hasconfig) {
    const configurator = document.getElementById("configurator");
    const overlay = document.getElementById("overlay");
    if (configurator && overlay) {
        configurator.style.display = "none";
        overlay.classList.add("show");
        initoverlay();
    }
}

const configform = document.getElementById("configform");
if (configform) {
    configform.addEventListener("submit", e => {
        e.preventDefault();
        generateoverlaylink();
    });
}

function generateoverlaylink() {
    const address = document.getElementById("wsaddress")?.value || "localhost";
    const port = document.getElementById("wsport")?.value || "16899";
    const activecolor = document.getElementById("activecolor")?.value || "#8b5cf6";
    const inactivecolor = document.getElementById("inactivecolor")?.value || "#808080";
    const backgroundcolor = document.getElementById("backgroundcolor")?.value || "#1a1a1a";
    const outlinecolor = document.getElementById("outlinecolor")?.value || "#ffffff";
    const glowradius = document.getElementById("glowradius")?.value || "24";
    const borderradius = document.getElementById("borderradius")?.value || "8";
    const pressscale = document.getElementById("pressscale")?.value || "105";
    const animationspeed = document.getElementById("animationspeed")?.value || "100";
    const scale = document.getElementById("scale")?.value || "100";
    const opacity = document.getElementById("opacity")?.value || "100";
    const fontfamily = document.getElementById("fontfamily")?.value || "";
    const fontcolor = document.getElementById("fontcolor")?.value || "#ffffff";
    const hidemouse = document.getElementById("hidemouse")?.checked || false;

    const params = new URLSearchParams();
    params.set("ws", address + ":" + port);
    params.set("activecolor", activecolor);
    params.set("inactivecolor", inactivecolor);
    params.set("backgroundcolor", backgroundcolor);
    params.set("outlinecolor", outlinecolor);
    params.set("glow", glowradius);
    params.set("radius", borderradius);
    params.set("pressscale", pressscale);
    params.set("speed", animationspeed);
    params.set("scale", scale);
    params.set("opacity", opacity);
    params.set("fontcolor", fontcolor);
    if (fontfamily) params.set("fontfamily", fontfamily);
    if (hidemouse) params.set("hidemouse", "0");

    const link = window.location.origin + window.location.pathname + "?" + params.toString();
    const generatedlink = document.getElementById("generatedlink");
    const linkresult = document.getElementById("linkresult");
    if (generatedlink) generatedlink.value = link;
    if (linkresult) linkresult.classList.add("show");
}

const copybtn = document.getElementById("copybtn");
if (copybtn) {
    copybtn.addEventListener("click", async () => {
        const linkinput = document.getElementById("generatedlink");
        if (!linkinput) return;
        try {
            await navigator.clipboard.writeText(linkinput.value);
            copybtn.textContent = "COPIED";
            copybtn.classList.add("copied");
            setTimeout(() => {
                copybtn.textContent = "COPY";
                copybtn.classList.remove("copied");
            }, 2000);
        } catch (err) {
            linkinput.select();
            document.execCommand("copy");
        }
    });
}

function initoverlay() {
    const statusel = document.getElementById("status");
    const keyboardcontainer = document.getElementById("keyboard");
    const scrolldisplay = document.getElementById("scrolldisplay");
    const scrollarrow = document.getElementById("scrollarrow");
    const scrollcount = document.getElementById("scrollcount");
    const bottomsection = document.getElementById("bottomsection");
    if (!statusel || !keyboardcontainer || !scrolldisplay || !scrollarrow || !scrollcount) {
        return;
    }

    const activecolor = urlparams.get("activecolor") || "#8b5cf6";
    const inactivecolor = urlparams.get("inactivecolor") || "#808080";
    const backgroundcolor = urlparams.get("backgroundcolor") || "#1a1a1a";
    const outlinecolor = urlparams.get("outlinecolor") || "#ffffff";
    const glowradius = urlparams.get("glow") || "24";
    const borderradius = urlparams.get("radius") || "8";
    const pressscale = urlparams.get("pressscale") || "105";
    const animationspeed = urlparams.get("speed") || "100";
    const scale = urlparams.get("scale") || "100";
    const opacity = urlparams.get("opacity") || "100";
    const fontfamily = urlparams.get("fontfamily");
    const fontcolor = urlparams.get("fontcolor") || "#ffffff";
    const hidemouse = urlparams.get("hidemouse") === "0";

    if (hidemouse && bottomsection) {
        bottomsection.classList.add("hidden");
    }

    const scalevalue = parseInt(scale) / 100;
    document.body.style.transform = "scale(" + scalevalue + ")";
    document.body.style.transformOrigin = "top left";
    document.body.style.opacity = (parseInt(opacity) / 100).toString();

    if (fontfamily) {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=" + fontfamily.replace(/ /g, "+") + "&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        document.body.style.fontFamily = `${fontfamily}, sans-serif`;
    }

    applyoverlaystyles({
        activecolor,
        inactivecolor,
        backgroundcolor,
        outlinecolor,
        glowradius,
        borderradius,
        pressscale,
        animationspeed,
        fontcolor
    });

    const wsconfig = (urlparams.get("ws") || "").split(":");
    const wsaddress = wsconfig[0] || "localhost";
    const wsport = wsconfig[1] || "16899";

    const keyelements = new Map();
    const mouseelements = new Map();

    document.querySelectorAll(".mouse-btn").forEach(btn => {
        const buttonname = btn.dataset.button;
        mouseelements.set(buttonname, btn);
    });

    const keyboardlayout = [
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

    keyboardlayout.forEach(row => {
        const rowel = document.createElement("div");
        rowel.className = "key-row";
        row.forEach(item => {
            const keyel = document.createElement("div");
            keyel.className = "key" + (item.class ? " " + item.class : "");
            keyel.textContent = item.label;
            keyel.dataset.key = item.key;
            rowel.appendChild(keyel);
            if (!item.class || item.class !== "invisible") {
                keyelements.set(item.key, keyel);
            }
        });
        keyboardcontainer.appendChild(rowel);
    });

    let ws;
    let connectionattempts = 0;
    let scrollcountvalue = 0;
    let scrolltimeout;
    let lastscrolldirection = null;
    const activekeys = new Set();
    const activemousebuttons = new Set();

    function connect() {
        connectionattempts++;
        const wsurl = "ws://" + wsaddress + ":" + wsport + "/";
        statusel.textContent = "CONNECTING TO " + wsurl + " (ATTEMPT " + connectionattempts + ")...";
        statusel.className = "status connecting";
        try {
            ws = new WebSocket(wsurl);
            ws.onopen = () => {
                connectionattempts = 0;
                statusel.textContent = "CONNECTED TO INPUT-OVERLAY AT " + wsurl;
                statusel.className = "status connected";
                clearstuckkeys();
            };
            ws.onmessage = e => {
                handleinputdata(e.data, keyelements, mouseelements, scrolldisplay, scrollarrow, scrollcount, activekeys, activemousebuttons, animationspeed);
            };
            ws.onerror = () => {
                statusel.textContent = "CONNECTION FAILED TO " + wsurl;
                statusel.className = "status error";
            };
            ws.onclose = () => {
                statusel.textContent = "DISCONNECTED. RECONNECTING IN 2 SECONDS...";
                statusel.className = "status connecting";
                ws = null;
                clearstuckkeys();
                setTimeout(connect, 2000);
            };
        } catch (error) {
            statusel.textContent = "ERROR: " + error.message;
            statusel.className = "status error";
            setTimeout(connect, 5000);
        }
    }

    function clearstuckkeys() {
        activekeys.forEach(keyname => {
            const keyel = keyelements.get(keyname);
            if (keyel) {
                keyel.classList.remove("active");
                keyel.style.zIndex = "";
            }
        });
        activekeys.clear();
        activemousebuttons.forEach(buttonname => {
            const mouseel = mouseelements.get(buttonname);
            if (mouseel) {
                mouseel.classList.remove("active");
                mouseel.style.zIndex = "";
            }
        });
        activemousebuttons.clear();
        scrolldisplay.classList.remove("active");
        scrollarrow.textContent = "-";
        scrollcount.textContent = "";
        scrollcount.classList.remove("animate");
        scrollcountvalue = 0;
        lastscrolldirection = null;
    }

    connect();

    setInterval(() => {
        const now = Date.now();
        if (!window.laststuckkeycheck) {
            window.laststuckkeycheck = now;
            return;
        }
        if (now - window.laststuckkeycheck > 30000) {
            window.laststuckkeycheck = now;
            if ((activekeys.size > 0 || activemousebuttons.size > 0) && (!ws || ws.readyState !== WebSocket.OPEN)) {
                clearstuckkeys();
            }
        }
    }, 5000);
}

const keycodemap = {
    2: "key_1",
    3: "key_2",
    4: "key_3",
    5: "key_4",
    16: "key_q",
    17: "key_w",
    18: "key_e",
    19: "key_r",
    30: "key_a",
    31: "key_s",
    32: "key_d",
    33: "key_f",
    42: "key_leftshift",
    29: "key_leftctrl",
    56: "key_leftalt",
    15: "key_tab",
    57: "key_space",
    1: "key_escape"
};

const mousebuttonmap = {
    1: "mouse_left",
    2: "mouse_right",
    3: "mouse_middle"
};

function handleinputdata(data, keyelements, mouseelements, scrolldisplay, scrollarrow, scrollcount, activekeys, activemousebuttons, animationspeed) {
    try {
        const event = JSON.parse(data);
        if (event.event_type === "key_pressed") {
            const keyname = keycodemap[event.keycode];
            if (keyname) {
                const keyel = keyelements.get(keyname);
                if (keyel) {
                    keyel.classList.add("active");
                    keyel.style.zIndex = "99999";
                    activekeys.add(keyname);
                }
            }
        } else if (event.event_type === "key_released") {
            const keyname = keycodemap[event.keycode];
            if (keyname) {
                const keyel = keyelements.get(keyname);
                if (keyel) {
                    keyel.classList.remove("active");
                    keyel.style.zIndex = "";
                    activekeys.delete(keyname);
                }
            }
        } else if (event.event_type === "mouse_pressed") {
            const buttonname = mousebuttonmap[event.button];
            if (buttonname) {
                const mouseel = mouseelements.get(buttonname);
                if (mouseel) {
                    mouseel.classList.add("active");
                    mouseel.style.zIndex = "99999";
                    activemousebuttons.add(buttonname);
                }
            }
        } else if (event.event_type === "mouse_released") {
            const buttonname = mousebuttonmap[event.button];
            if (buttonname) {
                const mouseel = mouseelements.get(buttonname);
                if (mouseel) {
                    mouseel.classList.remove("active");
                    mouseel.style.zIndex = "";
                    activemousebuttons.delete(buttonname);
                }
            }
        } else if (event.event_type === "mouse_wheel") {
            const currentdirection = event.rotation;

            if (window.lastscrolldirection !== null && window.lastscrolldirection !== currentdirection) {
                window.currentscrollcount = 0;
            }

            window.lastscrolldirection = currentdirection;
            window.currentscrollcount = (window.currentscrollcount || 0) + 1;

            scrollarrow.textContent = currentdirection === -1 ? "↑" : "↓";

            requestAnimationFrame(() => {
                scrollcount.textContent = window.currentscrollcount + "x";
                scrollcount.classList.remove("animate");
                void scrollcount.offsetWidth;
                scrollcount.classList.add("animate");
                scrolldisplay.classList.remove("active");
                void scrolldisplay.offsetWidth;
                scrolldisplay.classList.add("active");
            });

            clearTimeout(window.scrolltimeout);
            window.scrolltimeout = setTimeout(() => {
                scrollarrow.textContent = "-";
                scrollcount.textContent = "";
                scrollcount.classList.remove("animate");
                scrolldisplay.classList.remove("active");
                window.lastscrolldirection = null;
                window.currentscrollcount = 0;
            }, 150 * (100 / parseInt(animationspeed)));
        }
    } catch (error) {
    }
}

function applyoverlaystyles(opts) {
    const pressscalevalue = parseInt(opts.pressscale) / 100;
    const style = document.createElement("style");
    style.textContent =
        ".key{" +
        "border-radius:" + opts.borderradius + "px !important;" +
        "color:" + opts.inactivecolor + " !important;" +
        "background:" + opts.backgroundcolor + " !important;" +
        "border-color:" + opts.outlinecolor + "33 !important;" +
        "transition:all " + (0.15 * (100 / parseInt(opts.animationspeed))) + "s cubic-bezier(0.4,0,0.2,1) !important;" +
        "position:relative !important;" +
        "}" +
        ".key.active{" +
        "border-color:" + opts.activecolor + " !important;" +
        "box-shadow:0 8px " + opts.glowradius + "px " + opts.activecolor + "66 !important;" +
        "color:" + opts.fontcolor + " !important;" +
        "transform:translateY(-2px) scale(" + pressscalevalue + ") !important;" +
        "}" +
        ".key.active::before{" +
        "background:linear-gradient(135deg," + opts.activecolor + "4d," + opts.activecolor + "4d) !important;" +
        "}" +
        ".mouse-btn{" +
        "border-radius:" + opts.borderradius + "px !important;" +
        "color:" + opts.inactivecolor + " !important;" +
        "background:" + opts.backgroundcolor + " !important;" +
        "border-color:" + opts.outlinecolor + "33 !important;" +
        "transition:all " + (0.15 * (100 / parseInt(opts.animationspeed))) + "s cubic-bezier(0.4,0,0.2,1) !important;" +
        "position:relative !important;" +
        "}" +
        ".mouse-btn.active{" +
        "border-color:" + opts.activecolor + " !important;" +
        "box-shadow:0 8px " + opts.glowradius + "px " + opts.activecolor + "66 !important;" +
        "color:" + opts.fontcolor + " !important;" +
        "transform:translateY(-2px) scale(" + pressscalevalue + ") !important;" +
        "}" +
        ".mouse-btn.active::before{" +
        "background:linear-gradient(135deg," + opts.activecolor + "4d," + opts.activecolor + "4d) !important;" +
        "}" +
        ".scroll-display{" +
        "border-radius:" + opts.borderradius + "px !important;" +
        "color:" + opts.inactivecolor + " !important;" +
        "background:" + opts.backgroundcolor + " !important;" +
        "border-color:" + opts.outlinecolor + "33 !important;" +
        "transition:all " + (0.15 * (100 / parseInt(opts.animationspeed))) + "s cubic-bezier(0.4,0,0.2,1) !important;" +
        "}" +
        ".scroll-display.active{" +
        "border-color:" + opts.activecolor + " !important;" +
        "box-shadow:0 8px " + opts.glowradius + "px " + opts.activecolor + "66 !important;" +
        "color:" + opts.fontcolor + " !important;" +
        "transform:translateY(-2px) scale(" + pressscalevalue + ") !important;" +
        "}" +
        ".scroll-display.active::before{" +
        "background:linear-gradient(135deg," + opts.activecolor + "4d," + opts.activecolor + "4d) !important;" +
        "}" +
        ".scroll-count{" +
        "color:" + opts.fontcolor + " !important;" +
        "}";
    document.head.appendChild(style);
}