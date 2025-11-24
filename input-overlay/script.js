['keyactivecolor', 'mouseactivecolor', 'scrollactivecolor', 'inactivecolor'].forEach(id => {
    const colorinput = document.getElementById(id);
    const textinput = document.getElementById(id + 'text');
    if (colorinput && textinput) {
        colorinput.addEventListener('input', e => {
            textinput.value = e.target.value;
            updatecolorpreview();
        });
        textinput.addEventListener('input', e => {
            if (/^#[0-9a-f]{6}$/i.test(e.target.value)) {
                colorinput.value = e.target.value;
                updatecolorpreview();
            }
        });
    }
});

function updatecolorpreview() {
    const colors = [
        document.getElementById('keyactivecolor')?.value,
        document.getElementById('mouseactivecolor')?.value,
        document.getElementById('scrollactivecolor')?.value,
        document.getElementById('inactivecolor')?.value
    ];
    const samples = document.querySelectorAll('.color-sample');
    samples.forEach((sample, index) => {
        if (colors[index]) {
            sample.style.backgroundColor = colors[index];
        }
    });
}

updatecolorpreview();

const glowradiusel = document.getElementById('glowradius');
if (glowradiusel) {
    glowradiusel.addEventListener('input', e => {
        const valueel = document.getElementById('glowradiusvalue');
        if (valueel) valueel.textContent = e.target.value + 'px';
    });
}

const borderradiusel = document.getElementById('borderradius');
if (borderradiusel) {
    borderradiusel.addEventListener('input', e => {
        const valueel = document.getElementById('borderradiusvalue');
        if (valueel) valueel.textContent = e.target.value + 'px';
    });
}

const animationspeedel = document.getElementById('animationspeed');
if (animationspeedel) {
    animationspeedel.addEventListener('input', e => {
        const value = (e.target.value / 100).toFixed(1);
        const valueel = document.getElementById('animationspeedvalue');
        if (valueel) valueel.textContent = value + 'x';
    });
}

const scaleel = document.getElementById('scale');
if (scaleel) {
    scaleel.addEventListener('input', e => {
        const value = (e.target.value / 100).toFixed(1);
        const valueel = document.getElementById('scalevalue');
        if (valueel) valueel.textContent = value + 'x';
    });
}

const opacityel = document.getElementById('opacity');
if (opacityel) {
    opacityel.addEventListener('input', e => {
        const valueel = document.getElementById('opacityvalue');
        if (valueel) valueel.textContent = e.target.value + '%';
    });
}

const fontsizeel = document.getElementById('fontsize');
if (fontsizeel) {
    fontsizeel.addEventListener('input', e => {
        const valueel = document.getElementById('fontsizevalue');
        if (valueel) valueel.textContent = e.target.value + 'px';
    });
}

const urlparams = new URLSearchParams(window.location.search);
const hasconfig = urlparams.has('ws');

if (hasconfig) {
    const configurator = document.getElementById('configurator');
    const overlay = document.getElementById('overlay');
    if (configurator && overlay) {
        configurator.style.display = 'none';
        overlay.classList.add('show');
        initoverlay();
    }
} else {
    initconfigpreview();
}

const configform = document.getElementById('configform');
if (configform) {
    configform.addEventListener('submit', e => {
        e.preventDefault();
        generateoverlaylink();
    });
}

function generateoverlaylink() {
    const address = document.getElementById('wsaddress')?.value || 'localhost';
    const port = document.getElementById('wsport')?.value || '16899';
    const keyactivecolor = document.getElementById('keyactivecolor')?.value || '#8b5cf6';
    const mouseactivecolor = document.getElementById('mouseactivecolor')?.value || '#ec4899';
    const scrollactivecolor = document.getElementById('scrollactivecolor')?.value || '#3b82f6';
    const inactivecolor = document.getElementById('inactivecolor')?.value || '#808080';
    const glowradius = document.getElementById('glowradius')?.value || '24';
    const borderradius = document.getElementById('borderradius')?.value || '8';
    const animationspeed = document.getElementById('animationspeed')?.value || '100';
    const scale = document.getElementById('scale')?.value || '100';
    const opacity = document.getElementById('opacity')?.value || '100';
    const fonturl = document.getElementById('fonturl')?.value || '';
    const fontfamily = document.getElementById('fontfamily')?.value || '';
    const fontsize = document.getElementById('fontsize')?.value || '16';

    const params = new URLSearchParams();
    params.set('ws', address + ':' + port);
    params.set('keycolor', keyactivecolor);
    params.set('mousecolor', mouseactivecolor);
    params.set('scrollcolor', scrollactivecolor);
    params.set('inactivecolor', inactivecolor);
    params.set('glow', glowradius);
    params.set('radius', borderradius);
    params.set('speed', animationspeed);
    params.set('scale', scale);
    params.set('opacity', opacity);
    params.set('fontsize', fontsize);
    if (fonturl) params.set('fonturl', fonturl);
    if (fontfamily) params.set('fontfamily', fontfamily);

    const link = window.location.origin + window.location.pathname + '?' + params.toString();
    const generatedlink = document.getElementById('generatedlink');
    const linkresult = document.getElementById('linkresult');
    if (generatedlink) generatedlink.value = link;
    if (linkresult) linkresult.classList.add('show');
}

const copybtn = document.getElementById('copybtn');
if (copybtn) {
    copybtn.addEventListener('click', async () => {
        const linkinput = document.getElementById('generatedlink');
        if (!linkinput) return;
        try {
            await navigator.clipboard.writeText(linkinput.value);
            copybtn.textContent = 'copied';
            copybtn.classList.add('copied');
            setTimeout(() => {
                copybtn.textContent = 'copy';
                copybtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            linkinput.select();
            document.execCommand('copy');
        }
    });
}

function initoverlay() {
    const statusel = document.getElementById('status');
    const keyboardcontainer = document.getElementById('keyboard');
    const scrolldisplay = document.getElementById('scrolldisplay');
    const scrollarrow = document.getElementById('scrollarrow');
    const scrollcount = document.getElementById('scrollcount');
    if (!statusel || !keyboardcontainer || !scrolldisplay || !scrollarrow || !scrollcount) {
        return;
    }

    const keycolor = urlparams.get('keycolor') || '#8b5cf6';
    const mousecolor = urlparams.get('mousecolor') || '#ec4899';
    const scrollcolor = urlparams.get('scrollcolor') || '#3b82f6';
    const inactivecolor = urlparams.get('inactivecolor') || '#808080';
    const glowradius = urlparams.get('glow') || '24';
    const borderradius = urlparams.get('radius') || '8';
    const animationspeed = urlparams.get('speed') || '100';
    const scale = urlparams.get('scale') || '100';
    const opacity = urlparams.get('opacity') || '100';
    const fonturl = urlparams.get('fonturl');
    const fontfamily = urlparams.get('fontfamily');
    const fontsize = urlparams.get('fontsize') || '16';

    const scalevalue = parseInt(scale) / 100;
    document.body.style.transform = 'scale(' + scalevalue + ')';
    document.body.style.transformOrigin = 'top left';
    document.body.style.opacity = (parseInt(opacity) / 100).toString();
    document.body.style.fontSize = fontsize + 'px';

    if (fonturl) {
        if (fonturl.includes('fonts.googleapis.com')) {
            const link = document.createElement('link');
            link.href = fonturl;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        } else if (fonturl.match(/\.(ttf|otf|woff|woff2)$/i)) {
            const fontface = document.createElement('style');
            const fontname = fontfamily || 'customfont';
            fontface.textContent =
                '@font-face {' +
                "font-family: '" + fontname + "';" +
                "src: url('" + fonturl + "') format('" + getfontformat(fonturl) + "');" +
                '}';
            document.head.appendChild(fontface);
        }
    }

    if (fontfamily) {
        document.body.style.fontFamily = fontfamily;
    }

    applyoverlaystyles({
        keycolor,
        mousecolor,
        scrollcolor,
        inactivecolor,
        glowradius,
        borderradius,
        animationspeed
    });

    const wsconfig = (urlparams.get('ws') || '').split(':');
    const wsaddress = wsconfig[0] || 'localhost';
    const wsport = wsconfig[1] || '16899';

    const keyelements = new Map();
    const mouseelements = new Map();

    document.querySelectorAll('.mouse-btn').forEach(btn => {
        const buttonname = btn.dataset.button;
        mouseelements.set(buttonname, btn);
    });

    const keyboardlayout = [
        [
            { key: 'key_escape', label: 'esc', class: 'invisible' },
            { key: 'key_1', label: '1' },
            { key: 'key_2', label: '2' },
            { key: 'key_3', label: '3' },
            { key: 'key_4', label: '4' }
        ],
        [
            { key: 'key_tab', label: 'tab', class: 'wide' },
            { key: 'key_q', label: 'q' },
            { key: 'key_w', label: 'w' },
            { key: 'key_e', label: 'e' },
            { key: 'key_r', label: 'r' }
        ],
        [
            { key: 'key_leftshift', label: 'shift', class: 'extra-wide' },
            { key: 'key_a', label: 'a' },
            { key: 'key_s', label: 's' },
            { key: 'key_d', label: 'd' },
            { key: 'key_f', label: 'f' }
        ],
        [
            { key: 'key_leftctrl', label: 'ctrl', class: 'wide' },
            { key: 'key_leftalt', label: 'alt', class: 'wide' },
            { key: 'key_space', label: 'space', class: 'super-wide' }
        ]
    ];

    keyboardlayout.forEach(row => {
        const rowel = document.createElement('div');
        rowel.className = 'key-row';
        row.forEach(item => {
            const keyel = document.createElement('div');
            keyel.className = 'key' + (item.class ? ' ' + item.class : '');
            keyel.textContent = item.label;
            keyel.dataset.key = item.key;
            rowel.appendChild(keyel);
            if (!item.class || item.class !== 'invisible') {
                keyelements.set(item.key, keyel);
            }
        });
        keyboardcontainer.appendChild(rowel);
    });

    let ws;
    let connectionattempts = 0;
    let scrollcountvalue = 0;
    let scrolltimeout;
    let scrollanimtimeout;
    const activekeys = new Set();
    const activemousebuttons = new Set();

    function connect() {
        connectionattempts++;
        const wsurl = 'ws://' + wsaddress + ':' + wsport + '/';
        statusel.textContent = 'connecting to ' + wsurl + ' (attempt ' + connectionattempts + ')...';
        statusel.className = 'status connecting';
        try {
            ws = new WebSocket(wsurl);
            ws.onopen = () => {
                connectionattempts = 0;
                statusel.textContent = 'connected to input-overlay at ' + wsurl;
                statusel.className = 'status connected';
                clearstuckkeys();
            };
            ws.onmessage = e => {
                handleinputdata(e.data, keyelements, mouseelements, scrolldisplay, scrollarrow, scrollcount, activekeys, activemousebuttons, animationspeed);
            };
            ws.onerror = () => {
                statusel.textContent = 'connection failed to ' + wsurl;
                statusel.className = 'status error';
            };
            ws.onclose = () => {
                statusel.textContent = 'disconnected. reconnecting in 2 seconds...';
                statusel.className = 'status connecting';
                ws = null;
                clearstuckkeys();
                setTimeout(connect, 2000);
            };
        } catch (error) {
            statusel.textContent = 'error: ' + error.message;
            statusel.className = 'status error';
            setTimeout(connect, 5000);
        }
    }

    function clearstuckkeys() {
        activekeys.forEach(keyname => {
            const keyel = keyelements.get(keyname);
            if (keyel) {
                keyel.classList.remove('active');
            }
        });
        activekeys.clear();
        activemousebuttons.forEach(buttonname => {
            const mouseel = mouseelements.get(buttonname);
            if (mouseel) {
                mouseel.classList.remove('active');
            }
        });
        activemousebuttons.clear();
        scrolldisplay.classList.remove('active');
        scrollarrow.textContent = '-';
        scrollcount.textContent = '';
        scrollcountvalue = 0;
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
    2: 'key_1',
    3: 'key_2',
    4: 'key_3',
    5: 'key_4',
    16: 'key_q',
    17: 'key_w',
    18: 'key_e',
    19: 'key_r',
    30: 'key_a',
    31: 'key_s',
    32: 'key_d',
    33: 'key_f',
    42: 'key_leftshift',
    29: 'key_leftctrl',
    56: 'key_leftalt',
    15: 'key_tab',
    57: 'key_space',
    1: 'key_escape'
};

const mousebuttonmap = {
    1: 'mouse_left',
    2: 'mouse_right',
    3: 'mouse_middle'
};

function handleinputdata(data, keyelements, mouseelements, scrolldisplay, scrollarrow, scrollcount, activekeys, activemousebuttons, animationspeed) {
    try {
        const event = JSON.parse(data);
        if (event.event_type === 'key_pressed') {
            const keyname = keycodemap[event.keycode];
            if (keyname) {
                const keyel = keyelements.get(keyname);
                if (keyel) {
                    keyel.classList.add('active');
                    activekeys.add(keyname);
                }
            }
        } else if (event.event_type === 'key_released') {
            const keyname = keycodemap[event.keycode];
            if (keyname) {
                const keyel = keyelements.get(keyname);
                if (keyel) {
                    keyel.classList.remove('active');
                    activekeys.delete(keyname);
                }
            }
        } else if (event.event_type === 'mouse_pressed') {
            const buttonname = mousebuttonmap[event.button];
            if (buttonname) {
                const mouseel = mouseelements.get(buttonname);
                if (mouseel) {
                    mouseel.classList.add('active');
                    activemousebuttons.add(buttonname);
                }
            }
        } else if (event.event_type === 'mouse_released') {
            const buttonname = mousebuttonmap[event.button];
            if (buttonname) {
                const mouseel = mouseelements.get(buttonname);
                if (mouseel) {
                    mouseel.classList.remove('active');
                    activemousebuttons.delete(buttonname);
                }
            }
        } else if (event.event_type === 'mouse_wheel') {
            let scrollcountvalue = parseInt(scrollcount.textContent || '0', 10) || 0;
            scrollcountvalue++;
            scrollarrow.textContent = event.rotation === -1 ? '↑' : '↓';
            if (scrollcountvalue > 1) {
                scrollcount.textContent = scrollcountvalue;
            } else {
                scrollcount.textContent = '';
            }
            scrolldisplay.classList.remove('active');
            void scrolldisplay.offsetWidth;
            scrolldisplay.classList.add('active');
            clearTimeout(window.scrolltimeout);
            window.scrolltimeout = setTimeout(() => {
                scrollcountvalue = 0;
                scrollarrow.textContent = '-';
                scrollcount.textContent = '';
                scrolldisplay.classList.remove('active');
            }, 100 * (100 / parseInt(animationspeed)));
        }
    } catch (error) {
    }
}

function getfontformat(url) {
    if (url.includes('.woff2')) return 'woff2';
    if (url.includes('.woff')) return 'woff';
    if (url.includes('.ttf')) return 'truetype';
    if (url.includes('.otf')) return 'opentype';
    return 'truetype';
}

function applyoverlaystyles(opts) {
    const style = document.createElement('style');
    style.textContent =
        '.key{' +
        'border-radius:' + opts.borderradius + 'px !important;' +
        'color:' + opts.inactivecolor + ' !important;' +
        'transition:all ' + (0.15 * (100 / parseInt(opts.animationspeed))) + 's cubic-bezier(0.4,0,0.2,1) !important;' +
        '}' +
        '.key.active{' +
        'border-color:' + opts.keycolor + ' !important;' +
        'box-shadow:0 8px ' + opts.glowradius + 'px ' + opts.keycolor + '66 !important;' +
        'color:#fff !important;' +
        '}' +
        '.key.active::before{' +
        'background:linear-gradient(135deg,' + opts.keycolor + '4d,' + opts.keycolor + '4d) !important;' +
        '}' +
        '.mouse-btn{' +
        'border-radius:' + opts.borderradius + 'px !important;' +
        'color:' + opts.inactivecolor + ' !important;' +
        'transition:all ' + (0.15 * (100 / parseInt(opts.animationspeed))) + 's cubic-bezier(0.4,0,0.2,1) !important;' +
        '}' +
        '.mouse-btn.active{' +
        'border-color:' + opts.mousecolor + ' !important;' +
        'box-shadow:0 8px ' + opts.glowradius + 'px ' + opts.mousecolor + '66 !important;' +
        'color:#fff !important;' +
        '}' +
        '.mouse-btn.active::before{' +
        'background:linear-gradient(135deg,' + opts.mousecolor + '4d,' + opts.mousecolor + '4d) !important;' +
        '}' +
        '.scroll-display{' +
        'border-radius:' + opts.borderradius + 'px !important;' +
        'color:' + opts.inactivecolor + ' !important;' +
        'transition:all ' + (0.15 * (100 / parseInt(opts.animationspeed))) + 's cubic-bezier(0.4,0,0.2,1) !important;' +
        '}' +
        '.scroll-display.active{' +
        'border-color:' + opts.scrollcolor + ' !important;' +
        'box-shadow:0 8px ' + opts.glowradius + 'px ' + opts.scrollcolor + '66 !important;' +
        'color:#fff !important;' +
        '}' +
        '.scroll-display.active::before{' +
        'background:linear-gradient(135deg,' + opts.scrollcolor + '4d,' + opts.scrollcolor + '4d) !important;' +
        '}';
    document.head.appendChild(style);
}

function initconfigpreview() {
    const keyboardcontainer = document.getElementById('keyboard');
    if (!keyboardcontainer) return;

    const previewkeys = new Map();
    const previewmouse = new Map();

    const keyboardlayout = [
        [
            { key: 'key_escape', label: 'esc', class: 'invisible' },
            { key: 'key_1', label: '1' },
            { key: 'key_2', label: '2' },
            { key: 'key_3', label: '3' },
            { key: 'key_4', label: '4' }
        ],
        [
            { key: 'key_tab', label: 'tab', class: 'wide' },
            { key: 'key_q', label: 'q' },
            { key: 'key_w', label: 'w' },
            { key: 'key_e', label: 'e' },
            { key: 'key_r', label: 'r' }
        ],
        [
            { key: 'key_leftshift', label: 'shift', class: 'extra-wide' },
            { key: 'key_a', label: 'a' },
            { key: 'key_s', label: 's' },
            { key: 'key_d', label: 'd' },
            { key: 'key_f', label: 'f' }
        ],
        [
            { key: 'key_leftctrl', label: 'ctrl', class: 'wide' },
            { key: 'key_leftalt', label: 'alt', class: 'wide' },
            { key: 'key_space', label: 'space', class: 'super-wide' }
        ]
    ];

    keyboardcontainer.innerHTML = '';
    keyboardlayout.forEach(row => {
        const rowel = document.createElement('div');
        rowel.className = 'key-row';
        row.forEach(item => {
            const keyel = document.createElement('div');
            keyel.className = 'key' + (item.class ? ' ' + item.class : '');
            keyel.textContent = item.label;
            rowel.appendChild(keyel);
            if (!item.class || item.class !== 'invisible') {
                previewkeys.set(item.key, keyel);
            }
        });
        keyboardcontainer.appendChild(rowel);
    });

    document.querySelectorAll('.mouse-btn').forEach(btn => {
        const buttonname = btn.dataset.button;
        previewmouse.set(buttonname, btn);
    });

    function updatestylesfromform() {
        const keycolor = document.getElementById('keyactivecolor')?.value || '#8b5cf6';
        const mousecolor = document.getElementById('mouseactivecolor')?.value || '#ec4899';
        const scrollcolor = document.getElementById('scrollactivecolor')?.value || '#3b82f6';
        const inactivecolor = document.getElementById('inactivecolor')?.value || '#808080';
        const glowradius = document.getElementById('glowradius')?.value || '24';
        const borderradius = document.getElementById('borderradius')?.value || '8';
        const animationspeed = document.getElementById('animationspeed')?.value || '100';
        applyoverlaystyles({
            keycolor,
            mousecolor,
            scrollcolor,
            inactivecolor,
            glowradius,
            borderradius,
            animationspeed
        });
    }

    ['keyactivecolor', 'mouseactivecolor', 'scrollactivecolor', 'inactivecolor', 'glowradius', 'borderradius', 'animationspeed'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatestylesfromform);
        }
    });

    updatestylesfromform();

    window.addEventListener('keydown', e => {
        const code = e.code.toLowerCase();
        let keyname = null;
        if (code === 'digit1') keyname = 'key_1';
        if (code === 'digit2') keyname = 'key_2';
        if (code === 'digit3') keyname = 'key_3';
        if (code === 'digit4') keyname = 'key_4';
        if (code === 'keyq') keyname = 'key_q';
        if (code === 'keyw') keyname = 'key_w';
        if (code === 'keye') keyname = 'key_e';
        if (code === 'keyr') keyname = 'key_r';
        if (code === 'keya') keyname = 'key_a';
        if (code === 'keys') keyname = 'key_s';
        if (code === 'keyd') keyname = 'key_d';
        if (code === 'keyf') keyname = 'key_f';
        if (code === 'shiftleft') keyname = 'key_leftshift';
        if (code === 'controlleft') keyname = 'key_leftctrl';
        if (code === 'altleft') keyname = 'key_leftalt';
        if (code === 'tab') keyname = 'key_tab';
        if (code === 'space') keyname = 'key_space';
        if (code === 'escape') keyname = 'key_escape';
        if (!keyname) return;
        const keyel = previewkeys.get(keyname);
        if (keyel) keyel.classList.add('active');
    });

    window.addEventListener('keyup', e => {
        const code = e.code.toLowerCase();
        let keyname = null;
        if (code === 'digit1') keyname = 'key_1';
        if (code === 'digit2') keyname = 'key_2';
        if (code === 'digit3') keyname = 'key_3';
        if (code === 'digit4') keyname = 'key_4';
        if (code === 'keyq') keyname = 'key_q';
        if (code === 'keyw') keyname = 'key_w';
        if (code === 'keye') keyname = 'key_e';
        if (code === 'keyr') keyname = 'key_r';
        if (code === 'keya') keyname = 'key_a';
        if (code === 'keys') keyname = 'key_s';
        if (code === 'keyd') keyname = 'key_d';
        if (code === 'keyf') keyname = 'key_f';
        if (code === 'shiftleft') keyname = 'key_leftshift';
        if (code === 'controlleft') keyname = 'key_leftctrl';
        if (code === 'altleft') keyname = 'key_leftalt';
        if (code === 'tab') keyname = 'key_tab';
        if (code === 'space') keyname = 'key_space';
        if (code === 'escape') keyname = 'key_escape';
        if (!keyname) return;
        const keyel = previewkeys.get(keyname);
        if (keyel) keyel.classList.remove('active');
    });

    window.addEventListener('mousedown', e => {
        let btn = null;
        if (e.button === 0) btn = 'mouse_left';
        if (e.button === 1) btn = 'mouse_middle';
        if (e.button === 2) btn = 'mouse_right';
        if (!btn) return;
        const el = previewmouse.get(btn);
        if (el) el.classList.add('active');
    });

    window.addEventListener('mouseup', e => {
        let btn = null;
        if (e.button === 0) btn = 'mouse_left';
        if (e.button === 1) btn = 'mouse_middle';
        if (e.button === 2) btn = 'mouse_right';
        if (!btn) return;
        const el = previewmouse.get(btn);
        if (el) el.classList.remove('active');
    });

    window.addEventListener('wheel', e => {
        const scrolldisplay = document.getElementById('scrolldisplay');
        const scrollarrow = document.getElementById('scrollarrow');
        const scrollcount = document.getElementById('scrollcount');
        if (!scrolldisplay || !scrollarrow || !scrollcount) return;
        let scrollcountvalue = parseInt(scrollcount.textContent || '0', 10) || 0;
        scrollcountvalue++;
        scrollarrow.textContent = e.deltaY < 0 ? '↑' : '↓';
        if (scrollcountvalue > 1) {
            scrollcount.textContent = scrollcountvalue;
        } else {
            scrollcount.textContent = '';
        }
        scrolldisplay.classList.remove('active');
        void scrolldisplay.offsetWidth;
        scrolldisplay.classList.add('active');
        clearTimeout(window.scrolltimeoutpreview);
        window.scrolltimeoutpreview = setTimeout(() => {
            scrollcountvalue = 0;
            scrollarrow.textContent = '-';
            scrollcount.textContent = '';
            scrolldisplay.classList.remove('active');
        }, 150);
    });
}
