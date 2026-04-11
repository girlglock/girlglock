const ICONS = 'https://win98icons.alexmeub.com/icons/png/';
const ic = name => ICONS + name + '.png';

const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    HTML: '#e34c26', CSS: '#563d7c', 'C++': '#f34b7d', C: '#555555',
    Lua: '#000080', GDScript: '#355570', Shell: '#89e051', default: '#aaa'
};

const CONFIG = {
    site: {
        title: "dea's desktop",
        taskbarUrl: 'https://girlglock.com',
        startScale: 1.75,
    },
    desktopIcons: [
        { label: 'OBS Input Overlay', url: 'https://girlglock.com/input-overlay/', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/shell32.dll/ICON283_1.ico` },
        { label: 'Emote Combo Sounds', url: 'https://girlglock.com/emote-sounds/', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/shell32.dll/ICON277_1.ico` },
        { label: 'PNG-Tuber Tool', url: 'https://girlglock.com/speaking-cat/', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON70_1.ico` },
        { label: 'PS2 Wallpaper', url: 'https://girlglock.com/ps2/', icon: `https://raw.githubusercontent.com/bartekl1/windows-ui-assets/main/Icons/Windows%207/ico/imageres.dll/ICON72_1.ico` },
        { label: 'Voice Freq Monitor', url: 'https://girlglock.com/voicefreq/', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON150_1.ico` },
    ],
    layout: [
        ['win-about', 'win-gear'],
        ['win-spotify'],
        ['win-github', 'win-repos'],
    ],
    windows: [
        { id: 'win-about', title: 'About Me', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON88_1.ico`, width: 270, minWidth: 220, minHeight: 200, controls: ['minimize', 'maximize', 'close'], type: 'about' },
        { id: 'win-gaming', title: 'Currently Playing', icon: ic('joystick-4'), width: 260, minWidth: 200, minHeight: 80, controls: ['minimize', 'close'], type: 'gaming', hidden: true },
        { id: 'win-spotify', title: 'Windows Media Player', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON137_1.ico`, width: 340, minWidth: 200, minHeight: 200, height: 340, controls: ['minimize', 'maximize', 'close'], type: 'mediaplayer' },
        { id: 'win-gear', title: 'What I Use', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON109_1.ico`, width: 270, minWidth: 200, minHeight: 140, controls: ['minimize', 'maximize', 'close'], type: 'gear' },
        /* { id: 'win-github', title: 'GitHub Contributions', icon: ic('directory_open_file_mydocs-4'), width: 680, minWidth: 400, minHeight: 160, controls: ['minimize', 'maximize', 'close'], type: 'github' }, */
        { id: 'win-repos', title: 'Repos', icon: `https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/imageres.dll/ICON69_1.ico`, width: 380, minWidth: 300, minHeight: 200, maxHeight: 400, controls: ['minimize', 'maximize', 'close'], type: 'repos' },
    ],
    about: {
        discordId: '1167069721162686528',
        avatarHash: '25214ab1ddc0e2ae8f9c32daa77b63a9',
        name: 'dea',
        pronouns: 'she/her', 
        bio: 'I like movement FPS games, writing bad code, and making CS2 and Apex Legends R5R maps.',
        socials: [
            { label: 'BlueSky', url: 'https://bsky.app/profile/girlglock.com', icon: 'https://web-cdn.bsky.app/static/favicon-32x32.png' },
            { label: 'Twitter', url: 'https://x.com/girlglock_', icon: 'https://cdn-icons-png.flaticon.com/128/733/733579.png' },
            { label: 'GitHub', url: 'https://github.com/girlglock', icon: 'https://github.githubassets.com/favicons/favicon-dark.png' },
            { label: 'YouTube', url: 'https://www.youtube.com/@girIglock', icon: 'https://www.youtube.com/s/desktop/2f549df7/img/favicon.ico' },
            { label: 'Steam', url: 'https://steamcommunity.com/id/point_script/', icon: 'https://steamcommunity.com/favicon.ico' },
            { label: 'Ko-fi', url: 'https://ko-fi.com/girlglock', icon: 'https://ko-fi.com/favicon.png' },
        ],
    },
    gear: {
        hardware: [
            { label: 'Ryzen 9800X3D · 32GB · RTX 4070 Ti', icon: ic('computer_explorer-4') },
            { label: 'Wooting 60HE', icon: ic('keyboard-4') },
            { label: 'Pulsar X2 Crazylight', icon: ic('mouse-4') },
        ],
        software: [
            { label: 'Photoshop', icon: 'https://www.adobe.com/cc-shared/media_133224711e56efc866bc62f3fba34f5005ccfba4d.png?width=750&format=png&optimize=medium' },
            { label: 'Blender', icon: 'https://www.blender.org/wp-content/themes/bthree/assets/icons/favicon.svg' },
            { label: 'Source 2 Hammer', icon: ic('directory_open_file_mydocs-4') },
            { label: 'Premiere Pro', icon: 'https://www.adobe.com/cc-shared/media_146ee1a3bcfb86bfe6ac3164a4157418e5277eac4.png?width=750&format=png&optimize=medium' },
            { label: 'After Effects', icon: 'https://www.adobe.com/content/dam/shared/images/product-icons/svg/after-effects.svg' },
        ],
    },
    github: { username: 'girlglock', apiUrl: 'https://github-contributions-api.jogruber.de/v4/' },
    repos: { username: 'girlglock', count: 999 },
};

let topZ = 100;
const wState = {};

function mkEl(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
        try {
            if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
            else if (k === 'class') el.className = v;
            else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
            else el.setAttribute(k, v);
        } catch { }
    }
    for (const child of children) {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child) el.appendChild(child);
    }
    return el;
}

function mkImg(src, w = 14, h = 14, extra = {}) {
    return mkEl('img', { src, width: w, height: h, alt: '', style: { verticalAlign: 'middle', ...extra } });
}

function addResizeHandles(win) {
    for (const dir of ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se']) {
        win.appendChild(mkEl('div', { class: `rh rh-${dir}`, 'data-win': win.id, 'data-dir': dir }));
    }
}

function mkTitleBar(cfg) {
    const text = mkEl('div', { class: 'title-bar-text' }, [
        mkImg(cfg.icon, 14, 14, { marginRight: '4px' }),
        cfg.title,
    ]);
    const controls = mkEl('div', { class: 'title-bar-controls' });
    const ctrlMap = {
        minimize: ['Minimize', () => minimizeWin(cfg.id)],
        maximize: ['Maximize', () => maximizeWin(cfg.id)],
        close: ['Close', () => closeWin(cfg.id)],
    };
    for (const key of (cfg.controls || ['minimize', 'close'])) {
        const [label, handler] = ctrlMap[key];
        controls.appendChild(mkEl('button', { 'aria-label': label, onclick: handler }));
    }
    return mkEl('div', { class: 'title-bar' }, [text, controls]);
}

function mkWindow(cfg) {

    const win = mkEl('div', {
        class: 'win window glass',
        id: cfg.id,
        style: {
            width: cfg.width + 'px',
            minWidth: (cfg.minWidth || 180) + 'px',
            minHeight: (cfg.minHeight || 80) + 'px',
            maxHeight: (cfg.maxHeight || 99999) + 'px',
            height: cfg.height ? cfg.height + 'px' : '',
            display: cfg.hidden ? 'none' : 'flex',
        },
    });
    win.appendChild(mkTitleBar(cfg));
    win.appendChild(buildWindowBody(cfg));
    addResizeHandles(win);
    bindDrag(win);
    wState[cfg.id] = { minimized: false, closed: false, maxSave: null };
    return win;
}

function buildWindowBody(cfg) {
    switch (cfg.type) {
        case 'about': return buildAbout();
        case 'gaming': return buildGaming();
        case 'mediaplayer': return buildMediaPlayer();
        case 'gear': return buildGear();
        case 'github': return buildGithub();
        case 'repos': return buildRepos();
        default: return mkEl('div', { class: 'window-body' });
    }
}

function buildAbout() {
    const a = CONFIG.about;
    const body = mkEl('div', { class: 'window-body has-space' });

    const avatarImg = mkEl('img', {
        id: 'discord-avatar',
        src: `https://cdn.discordapp.com/avatars/${a.discordId}/${a.avatarHash}.png?size=64`,
        width: 52, height: 52,
        onerror: `this.src='https://cdn.discordapp.com/embed/avatars/0.png'`,
    });
    const avatarWrap = mkEl('div', { class: 'avatar-wrap' }, [avatarImg]);

    const nameRow = mkEl('div', { style: { fontWeight: '700' } }, ['hello im ']);
    nameRow.appendChild(mkEl('span', { style: { color: 'navy' } }, [a.name]));

    const statusDot = mkEl('span', { class: 'sdot s-offline', id: 'status-dot' });
    const statusText = mkEl('span', { id: 'status-text', style: { verticalAlign: 'middle', marginLeft: '3px' } }, ['offline']);

    const infoCol = mkEl('div', {}, [
        nameRow,
        mkEl('div', { style: { color: '#555' } }, [a.pronouns]),
        mkEl('div', { style: { marginTop: '3px' } }, [statusDot, statusText]),
    ]);

    const socialsGrid = mkEl('div', { class: 'social-btn-grid' });
    for (const s of a.socials) {
        socialsGrid.appendChild(mkEl('button', { onclick: () => window.open(s.url) }, [mkImg(s.icon, 12, 12), s.label]));
    }

    body.append(
        mkEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }, [avatarWrap, infoCol]),
        mkEl('p', { style: { marginBottom: '8px' } }, [a.bio]),
        mkEl('fieldset', {}, [mkEl('legend', {}, ['Socials']), socialsGrid])
    );
    return body;
}

function buildGaming() {
    const body = mkEl('div', { class: 'window-body has-space', style: { display: 'flex', alignItems: 'center', gap: '8px' } });
    const icon = mkEl('img', { id: 'game-icon', src: '', width: 40, height: 40, style: { display: 'none', flexShrink: '0' } });
    body.append(icon, mkEl('div', { style: { minWidth: '0' } }, [
        mkEl('div', { id: 'game-name', style: { fontWeight: '700' } }),
        mkEl('div', { id: 'game-state', style: { color: '#555' } }),
        mkEl('div', { id: 'game-elapsed', style: { color: '#888' } }),
    ]));
    return body;
}

function buildMediaPlayer() {
    const idle = mkEl('div', { id: 'mp-idle' }, [
        mkImg(`https://github.com/bartekl1/windows-ui-assets/raw/main/Icons/Windows%207/ico/shell32.dll/ICON293_1.ico`, 72, 72),
        mkEl('span', {}, ['Not playing anything']),
    ]);

    const active = mkEl('div', { id: 'mp-active' }, [
        mkEl('div', { class: 'mp-center' }, [
            mkEl('img', { class: 'mp-art', id: 'mp-art', src: '', alt: '' }),
        ]),
        mkEl('div', { class: 'mp-bottom' }, [
            mkEl('div', { class: 'mp-meta' }, [
                mkEl('div', { class: 'mp-song', id: 'mp-song' }),
                mkEl('div', { class: 'mp-artist', id: 'mp-artist' }),
                mkEl('div', { class: 'mp-album', id: 'mp-album' }),
            ]),
            mkEl('div', { class: 'mp-seek-track' }, [mkEl('div', { class: 'mp-seek-fill', id: 'mp-seek-fill' })]),
            mkEl('div', { class: 'mp-time-row' }, [mkEl('span', { id: 'mp-elapsed' }, ['0:00']), mkEl('span', { id: 'mp-total' }, ['0:00'])]),
            mkEl('div', { class: 'mp-btn-row' }, [
                mkEl('button', { onclick: () => window.open(document.getElementById('mp-link').href) }, [
                    mkImg('https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png', 11, 11),
                    ' Open in Spotify',
                ]),
                mkEl('a', { id: 'mp-link', href: '#', target: '_blank', style: { display: 'none' } }),
                mkEl('span', { class: 'mp-status', id: 'mp-status' }),
            ]),
        ]),
    ]);

    const content = mkEl('div', { class: 'mp-content' }, [idle, active]);
    return mkEl('div', { class: 'mp-outer' }, [content]);
}

function buildGear() {
    const g = CONFIG.gear;
    const body = mkEl('div', { class: 'window-body has-space' });
    const mkList = items => {
        const ul = mkEl('ul', { style: { listStyle: 'none', padding: '0', margin: '0', lineHeight: '1.9' } });
        for (const item of items) ul.appendChild(mkEl('li', {}, [mkImg(item.icon, 12, 12, { marginRight: '4px' }), item.label]));
        return ul;
    };
    body.append(
        mkEl('fieldset', {}, [mkEl('legend', {}, ['Hardware']), mkList(g.hardware)]),
        mkEl('fieldset', { style: { marginTop: '8px' } }, [mkEl('legend', {}, ['Software']), mkList(g.software)])
    );
    return body;
}

function buildGithub() {
    const wrap = mkEl('div', { class: 'gh-wrap', id: 'gh-wrap' }, [
        mkEl('div', { style: { color: '#888', padding: '4px' } }, ['Loading contributions...']),
    ]);
    const statusBar = mkEl('div', { class: 'status-bar', style: { display: 'flex', gap: '1px', flexShrink: '0' } }, [
        mkEl('p', { class: 'status-bar-field', id: 'gh-status' }, ['Fetching...']),
        mkEl('p', { class: 'status-bar-field', id: 'gh-total', style: { flexGrow: '0', whiteSpace: 'nowrap' } }),
    ]);
    return mkEl('div', { class: 'window-body no-scroll', style: { display: 'flex', flexDirection: 'column', padding: '0' } }, [wrap, statusBar]);
}

function buildRepos() {
    const toolbar = mkEl('div', { class: 'repo-toolbar' }, [
        mkEl('span', { style: { flex: '1', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px' } }, [`github.com/${CONFIG.repos.username}`]),
        mkEl('button', { onclick: () => loadRepos(), style: { minWidth: '0', height: '20px', padding: '0 8px' } }, ['Refresh']),
    ]);
    const list = mkEl('div', { class: 'repo-list', id: 'repo-list' }, [
        mkEl('div', { style: { padding: '10px', color: '#888' } }, ['Loading repositories...']),
    ]);
    const statusBar = mkEl('div', { class: 'status-bar', style: { display: 'flex', gap: '1px', flexShrink: '0' } }, [
        mkEl('p', { class: 'status-bar-field', id: 'repo-status' }, ['Fetching...']),
        mkEl('p', { class: 'status-bar-field', id: 'repo-count', style: { flexGrow: '0', whiteSpace: 'nowrap' } }),
    ]);
    return mkEl('div', { class: 'window-body no-scroll', style: { display: 'flex', flexDirection: 'column', padding: '0' } }, [toolbar, list, statusBar]);
}

function bindDrag(win) {
    let drag = false, ox = 0, oy = 0;
    const bar = win.querySelector('.title-bar');
    bar.addEventListener('mousedown', e => {
        if (e.target.closest('.title-bar-controls')) return;
        drag = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
        focusWin(win.id); e.preventDefault();
    });
    win.addEventListener('mousedown', () => focusWin(win.id));
    document.addEventListener('mousemove', e => {
        if (!drag) return;
        win.style.left = (e.clientX - ox) + 'px';
        win.style.top = Math.max(0, e.clientY - oy) + 'px';
    });
    document.addEventListener('mouseup', () => { drag = false; });
}

let resizeState = null;
document.addEventListener('mousedown', e => {
    const handle = e.target.closest('.rh');
    if (!handle) return;
    const win = document.getElementById(handle.dataset.win);
    resizeState = {
        win, dir: handle.dataset.dir,
        startX: e.clientX, startY: e.clientY,
        startL: win.offsetLeft, startT: win.offsetTop,
        startW: win.offsetWidth, startH: win.offsetHeight,
        minW: parseInt(win.style.minWidth) || 180,
        minH: parseInt(win.style.minHeight) || 80,
    };
    focusWin(win.id); e.preventDefault(); e.stopPropagation();
});
document.addEventListener('mousemove', e => {
    if (!resizeState) return;
    const { win, dir, startX, startY, startL, startT, startW, startH, minW, minH } = resizeState;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    const area = document.getElementById('desktop-area');
    let [L, T, W, H] = [startL, startT, startW, startH];
    if (dir.includes('e')) W = Math.max(minW, startW + dx);
    if (dir.includes('s')) H = Math.max(minH, startH + dy);
    if (dir.includes('w')) { W = Math.max(minW, startW - dx); L = startL + startW - W; }
    if (dir.includes('n')) { H = Math.max(minH, startH - dy); T = Math.max(0, startT + startH - H); }
    Object.assign(win.style, { left: L + 'px', top: T + 'px', width: W + 'px', height: H + 'px' });
});
document.addEventListener('mouseup', () => { resizeState = null; });

function focusWin(id) {
    document.querySelectorAll('.win').forEach(w => {
        w.classList.remove('focused');

        w.classList.remove('active');
        w.querySelector('.title-bar')?.classList.remove('active');
    });
    const el = document.getElementById(id);
    if (!el) return;
    el.style.zIndex = ++topZ;
    el.classList.add('focused', 'active');
    el.querySelector('.title-bar')?.classList.add('active');
    renderTaskbar();
}

function closeWin(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
    Object.assign(wState[id], { closed: true, minimized: false });
    el.classList.remove('focused', 'active');
    renderTaskbar();
}

function minimizeWin(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const s = wState[id];
    if (!s.minimized) { el.style.display = 'none'; s.minimized = true; }
    else { el.style.display = 'flex'; s.minimized = false; focusWin(id); }
    renderTaskbar();
}

function maximizeWin(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const s = wState[id];
    if (s.maxSave) {
        Object.assign(el.style, s.maxSave); s.maxSave = null;
    } else {
        s.maxSave = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height || '' };
        const area = document.getElementById('desktop-area');
        Object.assign(el.style, { left: '0', top: '0', width: area.clientWidth + 'px', height: area.clientHeight + 'px' });
    }
    focusWin(id);
}

function restoreWin(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'flex';
    Object.assign(wState[id], { closed: false, minimized: false });
    focusWin(id);
}

function renderTaskbar() {
    const bar = document.getElementById('taskbar-buttons');
    bar.innerHTML = '';
    for (const cfg of CONFIG.windows) {
        const el = document.getElementById(cfg.id);
        if (!el) continue;
        const s = wState[cfg.id];
        if (cfg.id === 'win-gaming' && !el.dataset.active) continue;
        const focused = el.classList.contains('focused') && !s.minimized && !s.closed;
        const btn = mkEl('button', {
            class: 'tb-btn' + (focused ? ' active' : ''),
            title: cfg.title,
            onclick: () => {
                if (s.closed) restoreWin(cfg.id);
                else if (s.minimized) minimizeWin(cfg.id);
                else if (focused) minimizeWin(cfg.id);
                else focusWin(cfg.id);
            },
        }, [mkImg(cfg.icon, 16, 16)]);
        bar.appendChild(btn);
    }
}

function layoutWindows() {
    const area = document.getElementById('desktop-area');
    const aW = area.clientWidth, aH = area.clientHeight;
    const PAD = 84, GAP = 10, CASCADE = 28;

    const cols = CONFIG.layout.map(col =>
        col.filter(id => { const cfg = CONFIG.windows.find(w => w.id === id); return cfg && !cfg.hidden; })
    );
    const colW = ids => Math.max(...ids.map(id => (document.getElementById(id) || { offsetWidth: 0 }).offsetWidth));
    const colH = ids => ids.reduce((s, id) => s + (document.getElementById(id) || { offsetHeight: 0 }).offsetHeight, 0) + (ids.length - 1) * GAP;

    const widths = cols.map(colW);
    const totalW = widths.reduce((s, w) => s + w, 0) + GAP * (cols.length - 1);
    let x = Math.max(PAD, Math.round((aW - totalW) / 2));


    const placed = [];
    function overlaps(ax, ay, aw, ah) {
        return placed.some(([bx, by, bw, bh]) =>
            ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
        );
    }
    function place(el, px, py) {
        const w = el.offsetWidth, h = el.offsetHeight;
        let cx = px, cy = py;
        while (overlaps(cx, cy, w, h)) { cx += CASCADE; cy += CASCADE; }
        cx = Math.max(0, Math.min(aW - w, cx));
        cy = Math.max(0, Math.min(aH - h, cy));
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
        placed.push([cx, cy, w, h]);
    }

    cols.forEach((ids, ci) => {
        let y = Math.max(GAP, Math.round((aH - colH(ids)) / 2));
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            place(el, x, y);
            y += el.offsetHeight + GAP;
        });
        x += widths[ci] + GAP;
    });

    const gw = document.getElementById('win-gaming');
    if (gw) {
        const sp = document.getElementById('win-spotify');
        const px = sp ? sp.offsetLeft + CASCADE : Math.round((aW - gw.offsetWidth) / 2);
        const py = sp ? sp.offsetTop + CASCADE : Math.round((aH - gw.offsetHeight) / 2);
        place(gw, px, py);
    }
}

function initDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    for (const cfg of CONFIG.desktopIcons) {
        container.appendChild(mkEl('a', { class: 'desktop-icon', href: cfg.url, target: '_blank', tabindex: '0' }, [
            mkEl('img', { src: cfg.icon, alt: '' }),
            mkEl('span', {}, [cfg.label]),
        ]));
    }
}

function initTaskbarStart() {
    const s = CONFIG.site;
    const btn = document.getElementById('taskbar-start');
    btn.onclick = () => window.open(s.taskbarUrl, '_blank');
    const size = 40 * s.startScale;
    document.documentElement.style.setProperty('--start-size', size + 'px');
    document.documentElement.style.setProperty('--start-size-3x', (size * 3) + 'px');
}

function init() {
    initDesktopIcons();
    initTaskbarStart();
    const area = document.getElementById('desktop-area');
    for (const cfg of CONFIG.windows) area.appendChild(mkWindow(cfg));
    requestAnimationFrame(() => requestAnimationFrame(() => {
        layoutWindows();
        focusWin('win-about');
        renderTaskbar();
    }));
}

init();

function updateClock() {
    const el = document.getElementById('tray-clock');
    if (!el) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
    el.innerHTML = `<span class="tray-time">${time}</span><br><span class="tray-date">${date}</span>`;
}
updateClock();
setInterval(updateClock, 10000);

const DISCORD_ID = CONFIG.about.discordId;
let ws, hbInterval, spotifyTimer, gameTimer;

function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function setStatus(status) {
    const cls = { online: 's-online', idle: 's-idle', dnd: 's-dnd', offline: 's-offline' };
    const labels = { online: 'online', idle: 'idle', dnd: 'do not disturb', offline: 'offline' };
    const sd = document.getElementById('status-dot'); if (sd) sd.className = 'sdot ' + (cls[status] || 's-offline');
    const st = document.getElementById('status-text'); if (st) st.textContent = labels[status] || status;
}

function updateSpotify(data) {
    const sp = data.spotify;
    const show = data.listening_to_spotify && sp;
    document.getElementById('mp-idle').style.display = show ? 'none' : 'flex';
    document.getElementById('mp-active').style.display = show ? 'flex' : 'none';
    if (spotifyTimer) clearInterval(spotifyTimer);
    if (!show) return;
    document.getElementById('mp-art').src = sp.album_art_url;
    document.getElementById('mp-song').textContent = sp.song;
    document.getElementById('mp-artist').textContent = sp.artist;
    document.getElementById('mp-album').textContent = sp.album;
    document.getElementById('mp-link').href = 'https://open.spotify.com/track/' + sp.track_id;
    document.getElementById('mp-total').textContent = fmtTime(sp.timestamps.end - sp.timestamps.start);
    document.getElementById('mp-status').textContent = sp.artist;

    spotifyTimer = setInterval(() => {
        const elapsed = Date.now() - sp.timestamps.start;
        const total = sp.timestamps.end - sp.timestamps.start;
        const fill = document.getElementById('mp-seek-fill');
        if (fill) fill.style.width = Math.min(100, (elapsed / total) * 100) + '%';
        const el = document.getElementById('mp-elapsed');
        if (el) el.textContent = fmtTime(Math.min(elapsed, total));
        if (elapsed >= total) clearInterval(spotifyTimer);
    }, 1000);
}

function updateGaming(activities) {
    const game = (activities || []).find(a => a.type === 0);
    const winEl = document.getElementById('win-gaming');
    if (!winEl) return;

    if (game) {
        winEl.dataset.active = '1';
        if (!wState['win-gaming'].closed && !wState['win-gaming'].minimized) winEl.style.display = 'flex';
        document.getElementById('game-name').textContent = game.name;
        document.getElementById('game-state').textContent = game.state || '';
        const icon = document.getElementById('game-icon');
        if (game.application_id) {
            icon.src = `https://cdn.discordapp.com/app-icons/${game.application_id}/icon.png`;
            icon.style.display = 'block';
            icon.onerror = () => { icon.style.display = 'none'; };
        } else { icon.style.display = 'none'; }

        if (gameTimer) clearInterval(gameTimer);
        const start = game.timestamps?.start;
        if (start) {
            const tick = () => {
                const ms = Date.now() - start;
                const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
                const el = document.getElementById('game-elapsed');
                if (el) el.textContent = (h > 0 ? h + 'h ' : '') + m + 'm ' + s + 's elapsed';
            };
            tick(); gameTimer = setInterval(tick, 1000);
        }
    } else {
        delete winEl.dataset.active;
        winEl.style.display = 'none';
        if (gameTimer) clearInterval(gameTimer);
    }
    renderTaskbar();
}

function handlePresence(data) {
    setStatus(data.discord_status);
    updateSpotify(data);
    updateGaming(data.activities || []);
    if (data.discord_user?.avatar) {
        const el = document.getElementById('discord-avatar');
        if (el) el.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png?size=64`;
    }
}

function connectLanyard() {
    ws = new WebSocket('wss://api.lanyard.rest/socket');
    ws.onmessage = e => {
        try {
            const msg = JSON.parse(e.data);
            if (msg.op === 1) {
                hbInterval = setInterval(() => { if (ws.readyState === 1) ws.send(JSON.stringify({ op: 3 })); }, msg.d.heartbeat_interval);
                ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
            } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
                handlePresence(msg.d);
            }
        } catch { }
    };
    ws.onclose = () => { clearInterval(hbInterval); setTimeout(connectLanyard, 5000); };
    ws.onerror = () => ws.close();
}
connectLanyard();

async function loadGitHub() {
    const wrap = document.getElementById('gh-wrap');
    const statusEl = document.getElementById('gh-status');
    const totalEl = document.getElementById('gh-total');
    try {
        const resp = await fetch(CONFIG.github.apiUrl + CONFIG.github.username + '?y=last');
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        const contributions = data.contributions;
        const total = (data.total?.lastYear != null) ? data.total.lastYear : contributions.reduce((s, d) => s + d.count, 0);

        const sorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const byWeek = []; let week = [];
        for (let i = 0; i < new Date(sorted[0].date).getDay(); i++) week.push(null);
        sorted.forEach(d => { week.push(d); if (week.length === 7) { byWeek.push(week); week = []; } });
        if (week.length) { while (week.length < 7) week.push(null); byWeek.push(week); }

        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonth = -1;
        const monthRow = mkEl('div', { style: { display: 'flex', marginBottom: '2px' } });
        byWeek.forEach(w => {
            const first = w.find(d => d);
            const m = first ? new Date(first.date).getMonth() : -1;
            const lbl = (m !== -1 && m !== lastMonth) ? MONTHS[m] : '';
            if (m !== -1) lastMonth = m;
            monthRow.appendChild(mkEl('span', { style: { width: '12px', flexShrink: '0', color: '#444', overflow: 'hidden' } }, [lbl]));
        });

        const COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
        const grid = mkEl('div', { style: { display: 'flex', gap: '2px' } });
        byWeek.forEach(w => {
            const col = mkEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } });
            w.forEach(d => {
                const cell = mkEl('div', { style: { width: '10px', height: '10px', flexShrink: '0', background: d ? COLORS[d.level] || COLORS[0] : 'transparent' } });
                if (d) cell.title = `${d.date}: ${d.count} contribution${d.count !== 1 ? 's' : ''}`;
                col.appendChild(cell);
            });
            grid.appendChild(col);
        });

        const legend = mkEl('div', { style: { display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '4px', color: '#666' } }, ['Less ']);
        COLORS.forEach(c => legend.appendChild(mkEl('div', { style: { width: '10px', height: '10px', background: c, flexShrink: '0' } })));
        legend.appendChild(document.createTextNode(' More'));

        wrap.innerHTML = '';
        wrap.append(monthRow, grid, legend);
        if (statusEl) statusEl.textContent = `github.com/${CONFIG.github.username}`;
        if (totalEl) totalEl.textContent = total + ' contributions in the last year';
    } catch {
        wrap.innerHTML = '';
        wrap.appendChild(mkEl('div', { style: { padding: '8px', color: '#666' } }, [
            'Could not load contributions. ',
            mkEl('button', { onclick: () => loadGitHub() }, ['Retry']),
        ]));
        if (statusEl) statusEl.textContent = 'Error loading data';
    }
}
loadGitHub();

async function loadRepos() {
    const list = document.getElementById('repo-list');
    const statusEl = document.getElementById('repo-status');
    const countEl = document.getElementById('repo-count');
    if (statusEl) statusEl.textContent = 'Fetching...';
    list.innerHTML = '';
    list.appendChild(mkEl('div', { style: { padding: '10px', color: '#888' } }, ['Loading repositories...']));
    try {
        const resp = await fetch(`https://api.github.com/users/${CONFIG.repos.username}/repos?sort=pushed&per_page=${CONFIG.repos.count}`);
        if (!resp.ok) throw new Error();
        const repos = (await resp.json()).sort((a, b) => b.stargazers_count - a.stargazers_count);
        list.innerHTML = '';
        for (const repo of repos) {
            const langDot = repo.language ? mkEl('span', { class: 'repo-lang-dot', style: { background: LANG_COLORS[repo.language] || LANG_COLORS.default } }) : null;
            const meta = mkEl('div', { class: 'repo-meta' }, [
                ...(repo.language ? [langDot, repo.language + '  '] : []),
                '★ ' + repo.stargazers_count,
                repo.fork ? mkEl('span', { class: 'repo-tag' }, ['fork']) : null,
            ].filter(Boolean));
            const item = mkEl('div', { class: 'repo-item', onclick: () => window.open(repo.html_url, '_blank') }, [
                mkEl('div', { class: 'repo-name' }, [mkImg(ic('directory_open_file_mydocs-4'), 12, 12, { marginRight: '4px' }), repo.name]),
                repo.description ? mkEl('div', { class: 'repo-desc' }, [repo.description]) : null,
                meta,
            ].filter(Boolean));
            list.appendChild(item);
        }
        if (statusEl) statusEl.textContent = `github.com/${CONFIG.repos.username}`;
        if (countEl) countEl.textContent = repos.length + ' repos';
    } catch {
        list.innerHTML = '';
        list.appendChild(mkEl('div', { style: { padding: '10px', color: '#666' } }, [
            'Could not load repositories. ',
            mkEl('button', { onclick: () => loadRepos() }, ['Retry']),
        ]));
        if (statusEl) statusEl.textContent = 'Error';
    }
}
loadRepos();