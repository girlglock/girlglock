const _ld = {
    el: null, title: null, msg: null, bar: null, sub: null,
    init() {
        this.el  = document.getElementById('loadingDialog');
        this.title = document.getElementById('loadingDialogTitle');
        this.msg  = document.getElementById('loadingDialogMsg');
        this.bar  = document.getElementById('loadingDialogBar');
        this.sub  = document.getElementById('loadingDialogSub');
    }
};
function showLoading(title, msg, pct = 0, sub = '') {
    if (!_ld.el) _ld.init();
    _ld.title.textContent = title;
    _ld.msg.textContent   = msg;
    _ld.bar.style.width   = pct + '%';
    _ld.sub.textContent   = sub;
    _ld.el.style.display  = 'flex';
}
function updateLoading(msg, pct, sub = '') {
    if (!_ld.el) return;
    if (msg  !== undefined) _ld.msg.textContent = msg;
    if (pct  !== undefined) _ld.bar.style.width = pct + '%';
    if (sub  !== undefined) _ld.sub.textContent = sub;
}
function hideLoading() {
    if (!_ld.el) return;
    _ld.bar.style.width  = '100%';
    setTimeout(() => { _ld.el.style.display = 'none'; _ld.bar.style.width = '0%'; }, 260);
}

const selectedIndices = new Set();

const emoteUrlCache = new Map(); //name to url
let channelEmoteList = [];
let emotePreviewFetchController = null;

async function fetchChannelEmotes() {
    const channelName = document.getElementById('channelName').value.trim().toLowerCase();
    if (!channelName) return;

    emoteUrlCache.clear();
    channelEmoteList = [];

    const proxy = 'https://api.roaringiron.com/proxy/';
    const add = (name, url) => { channelEmoteList.push({ name, url }); emoteUrlCache.set(name, url); };

    showLoading('fetching emotes', 'looking up channel: ' + channelName, 5, 'connecting to twitch...');
    try {
        const idRes = await fetch(proxy + 'https://api.ivr.fi/v2/twitch/user?login=' + channelName, { headers: { 'User-Agent': 'emote-sounds-configurator' } });
        const idData = await idRes.json();
        const twitchId = idData?.[0]?.id;

        if (twitchId) {
            updateLoading('loading BetterTTV emotes...', 20, 'channel: ' + channelName);
            await fetch(proxy + 'https://api.betterttv.net/3/cached/users/twitch/' + twitchId).then(r => r.json()).then(d => { [...(d.channelEmotes || []), ...(d.sharedEmotes || [])].forEach(e => add(e.code, 'https://cdn.betterttv.net/emote/' + e.id + '/2x')); }).catch(() => {});
            updateLoading('loading 7TV emotes...', 38, 'channel: ' + channelName);
            await fetch(proxy + 'https://7tv.io/v3/users/twitch/' + twitchId).then(r => r.json()).then(d => { const es = d?.emote_set?.emotes || []; es.forEach(e => add(e.name, 'https:' + e.data.host.url + '/' + (e.data.host.files[2]?.name || e.data.host.files[0]?.name))); }).catch(() => {});
            updateLoading('loading FrankerFaceZ emotes...', 54, 'channel: ' + channelName);
            await fetch(proxy + 'https://api.frankerfacez.com/v1/room/' + channelName).then(r => r.json()).then(d => { for (const k of Object.keys(d.sets || {})) for (const e of d.sets[k].emoticons) add(e.name, 'https://' + (e.urls['2'] || e.urls['1']).split('//').pop()); }).catch(() => {});
        }
        updateLoading('loading global emotes...', 68, 'BTTV globals');
        await fetch(proxy + 'https://api.betterttv.net/3/cached/emotes/global').then(r => r.json()).then(d => { (d || []).forEach(e => add(e.code, 'https://cdn.betterttv.net/emote/' + e.id + '/2x')); }).catch(() => {});
        updateLoading('loading global emotes...', 80, '7TV globals');
        await fetch(proxy + 'https://7tv.io/v3/emote-sets/global').then(r => r.json()).then(d => { (d.emotes || []).forEach(e => add(e.name, 'https://cdn.7tv.app/emote/' + e.id + '/2x.webp')); }).catch(() => {});
        updateLoading('loading global emotes...', 90, 'FFZ globals');
        await fetch(proxy + 'https://api.frankerfacez.com/v1/set/global').then(r => r.json()).then(d => { for (const k of Object.keys(d.sets || {})) for (const e of d.sets[k].emoticons) add(e.name, 'https://' + (e.urls['2'] || e.urls['1']).split('//').pop()); }).catch(() => {});
    } catch (e) { /* silent */ }

    updateLoading('updating previews...', 97, emoteUrlCache.size + ' emotes loaded');
    refreshAllEmotePreviews();
    hideLoading();
}

function getEmotePreviewUrl(name) {
    return emoteUrlCache.get(name) || null;
}

function refreshAllEmotePreviews() {
    emotes.forEach((emote, index) => {
        const url = getEmotePreviewUrl(emote.name);
        const titleImg = document.getElementById('emote-icon-' + index);
        if (titleImg) {
            titleImg.src = url || '';
            titleImg.style.display = url ? 'inline-block' : 'none';
        }
        const tbImg = document.getElementById('tb-icon-' + index);
        if (tbImg) {
            tbImg.src = url || '';
            tbImg.style.display = url ? 'inline-block' : 'none';
        }
    });
}

function refreshEmotePreview(index) {
    const emote = emotes[index];
    if (!emote) return;
    const url = getEmotePreviewUrl(emote.name);
    const titleImg = document.getElementById('emote-icon-' + index);
    if (titleImg) {
        titleImg.src = url || '';
        titleImg.style.display = url ? 'inline-block' : 'none';
    }
    const tbImg = document.getElementById('tb-icon-' + index);
    if (tbImg) {
        tbImg.src = url || '';
        tbImg.style.display = url ? 'inline-block' : 'none';
    }
}

function toggleCardSelect(index, e) {

    if (e.target.closest('.title-bar-controls')) return;
    if (!e.ctrlKey && !e.metaKey) {
        selectedIndices.clear();
        selectedIndices.add(index);
    } else {
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
        } else {
            selectedIndices.add(index);
        }
    }
    updateCardSelection();
    updateSelectionBanner();
}

function updateCardSelection() {
    document.querySelectorAll('.emote-card').forEach((card, i) => {
        const titleBar = card.querySelector('.title-bar');
        if (selectedIndices.has(i)) {
            titleBar.classList.remove('inactive');
        } else {
            titleBar.classList.add('inactive');
        }
    });
}

function updateSelectionBanner() {
    let banner = document.getElementById('selection-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'selection-banner';
        banner.className = 'selection-banner';
        banner.innerHTML = '<span id="sel-count"></span><span class="sel-hint" id="sel-hint"></span>';
        document.getElementById('emoteList').before(banner);
    }
    if (selectedIndices.size > 1) {
        document.getElementById('sel-count').textContent = selectedIndices.size + ' emotes selected  ';
        document.getElementById('sel-hint').textContent = 'editing synced across all selected';
    } else {
        document.getElementById('sel-count').textContent = '';
        document.getElementById('sel-hint').textContent = 'ctrl+click to select multiple emotes';
    }
    document.querySelectorAll('.cfg-taskbar-btn').forEach((btn, i) => {
        btn.classList.toggle('active', selectedIndices.has(i));
    });
}

function renderTaskbar() {
    const bar = document.getElementById('taskbarButtons');
    if (!bar) return;
    bar.innerHTML = '';
    emotes.forEach((emote, index) => {
        const btn = document.createElement('button');
        btn.className = 'cfg-taskbar-btn' + (selectedIndices.has(index) ? ' active' : '');
        btn.title = emote.name || 'emote';
        const url = getEmotePreviewUrl(emote.name);
        const img = document.createElement('img');
        img.id = 'tb-icon-' + index;
        img.src = url || '';
        img.style.cssText = 'width:16px;height:16px;object-fit:contain;image-rendering:pixelated;vertical-align:middle;margin-right:3px;flex-shrink:0;';
        img.style.display = url ? 'inline-block' : 'none';
        const label = document.createElement('span');
        label.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        label.textContent = emote.name || 'emote';
        btn.appendChild(img);
        btn.appendChild(label);
        btn.addEventListener('click', (e) => {
            toggleCardSelect(index, e);

            const card = document.getElementById('card-' + index);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        bar.appendChild(btn);
    });
}

function updateEmoteMulti(index, field, value) {
    const targets = (selectedIndices.size > 1 && selectedIndices.has(index))
        ? [...selectedIndices]
        : [index];
    for (const i of targets) {
        emotes[i][field] = value;
    }

    if (field !== 'name' && field !== 'minStreak') {
        for (const i of targets) {
            if (i === index) continue;
            const el = document.getElementById(field + '-label-' + i);
            if (el) {
                el.textContent = field === 'volume' ? emotes[i][field].toFixed(2) : emotes[i][field].toFixed(1);
            }
            const range = document.querySelector(`#card-${i} [data-field="${field}"]`);
            if (range) range.value = value;
        }
    }
    if (field === 'minStreak') {
        for (const i of targets) {
            if (i === index) continue;
            const inp = document.querySelector(`#card-${i} .cfg-streak-input`);
            if (inp) inp.value = value;
        }
    }
}

function renderEmotes() {
    const list = document.getElementById("emoteList");
    list.innerHTML = "";

    const empty = document.getElementById("emptyState");
    if (empty) empty.style.display = emotes.length === 0 ? "flex" : "none";

    for (const i of selectedIndices) {
        if (i >= emotes.length) selectedIndices.delete(i);
    }
    updateSelectionBanner();

    emotes.forEach((emote, index) => {
        const isSelected = selectedIndices.has(index);

        const card = document.createElement("div");
        card.className = "emote-card window";
        card.id = `card-${index}`;

        const previewUrl = getEmotePreviewUrl(emote.name);
        card.innerHTML = `
            <div class="title-bar${isSelected ? "" : " inactive"}" onclick="toggleCardSelect(${index}, event)">
                <div class="title-bar-text"><img id="emote-icon-${index}" src="${previewUrl || ''}" style="width:14px;height:14px;object-fit:contain;image-rendering:pixelated;vertical-align:middle;margin-right:4px;${previewUrl ? '' : 'display:none;'}">${emote.name || "emote"}</div>
                <div class="title-bar-controls">
                    <button aria-label="Close" onclick="event.stopPropagation(); removeEmote(${index})"></button>
                </div>
            </div>
            <div class="window-body emote-card-body">
                <div class="emote-field-row">
                    <label for="name-${index}">emote name</label>
                    <input id="name-${index}" type="text" value="${emote.name}" onchange="updateEmote(${index}, 'name', this.value); const tbEl=document.getElementById('emote-icon-${index}'); if(tbEl){tbEl.parentNode.childNodes[tbEl.parentNode.childNodes.length-1].textContent=this.value||'emote';} const titleTextNode=document.querySelector('#card-${index} .title-bar-text'); if(titleTextNode){const lastChild=titleTextNode.lastChild; if(lastChild&&lastChild.nodeType===3)lastChild.textContent=this.value||'emote'; else titleTextNode.append(this.value||'emote');} const tbSpan=document.querySelector('#taskbarButtons .cfg-taskbar-btn:nth-child(${index+1}) span'); if(tbSpan){tbSpan.textContent=this.value||'emote';} const tbBtn=document.querySelector('#taskbarButtons .cfg-taskbar-btn:nth-child(${index+1})'); if(tbBtn){tbBtn.title=this.value||'emote';} refreshEmotePreview(${index});">
                </div>
                <div class="emote-field-row" style="margin-top:8px;">
                    <label for="streak-${index}">required streak</label>
                    <input id="streak-${index}" class="cfg-streak-input" type="number" value="${emote.minStreak}" min="1" step="1" style="width:60px;" onchange="updateEmoteMulti(${index}, 'minStreak', parseInt(this.value))">
                </div>
                <fieldset style="margin-top:10px;">
                    <legend>speed &amp; volume</legend>
                    <div class="emote-slider-row">
                        <label>min speed <span class="win98-val" id="speedMin-label-${index}">${emote.speedMin.toFixed(1)}</span></label>
                        <input type="range" min="0.1" max="5" step="0.1" value="${emote.speedMin}" data-field="speedMin" oninput="updateEmoteAndDisplay(${index}, 'speedMin', parseFloat(this.value), this)">
                    </div>
                    <div class="emote-slider-row">
                        <label>max speed <span class="win98-val" id="speedMax-label-${index}">${emote.speedMax.toFixed(1)}</span></label>
                        <input type="range" min="0.1" max="5" step="0.1" value="${emote.speedMax}" data-field="speedMax" oninput="updateEmoteAndDisplay(${index}, 'speedMax', parseFloat(this.value), this)">
                    </div>
                    <div class="emote-slider-row">
                        <label>volume <span class="win98-val" id="volume-label-${index}">${emote.volume.toFixed(2)}</span></label>
                        <input type="range" min="0" max="1" step="0.025" value="${emote.volume}" data-field="volume" oninput="updateEmoteAndDisplay(${index}, 'volume', parseFloat(this.value), this)">
                    </div>
                </fieldset>
                <fieldset style="margin-top:6px;">
                    <legend>sound files</legend>
                    <div class="cfg-sound-list" id="soundList${index}">
                        ${emote.sounds.map((sound, sIndex) => `
                            <div class="cfg-sound-item">
                                <label style="display:contents;"><input type="file" accept="audio/*" id="file-${index}-${sIndex}" onchange="updateSound(${index}, ${sIndex}, this.files[0])" hidden></label><button onclick="document.getElementById('file-${index}-${sIndex}').click()">choose file</button>
                                <button ${!sound.data ? "disabled" : ""} onclick="togglePlay(${index}, ${sIndex})">${sound.isPlaying ? "■" : "▶︎"}</button>
                                <span class="cfg-sound-name">${sound.name || "no file selected"}</span>
                                <button onclick="removeSound(${index}, ${sIndex})">x</button>
                            </div>
                        `).join("")}
                    </div>
                    <div style="margin-top:6px;">
                        <button onclick="addSound(${index})">+ add sound</button>
                    </div>
                </fieldset>
            </div>
        `;
        list.appendChild(card);
    });
    renderTaskbar();
}

function addEmote() {
    emotes.push({
        name: "newemote",
        minStreak: 4,
        volume: 1.0,
        speedMin: 0.5,
        speedMax: 2.0,
        sounds: []
    });
    renderEmotes();
}

function removeEmote(index) {
    emotes.splice(index, 1);

    const updated = new Set();
    for (const i of selectedIndices) {
        if (i === index) continue;
        if (i > index) updated.add(i - 1);
        else updated.add(i);
    }
    selectedIndices.clear();
    for (const i of updated) selectedIndices.add(i);
    renderEmotes();
}

function updateEmote(index, field, value) {
    emotes[index][field] = value;
}

function updateEmoteAndDisplay(index, field, value, element) {

    const targets = (selectedIndices.size > 1 && selectedIndices.has(index))
        ? [...selectedIndices]
        : [index];
    for (const i of targets) {
        emotes[i][field] = value;
        const labelElement = document.getElementById(`${field}-label-${i}`);
        if (labelElement) {
            labelElement.textContent = field === "volume" ? value.toFixed(2) : value.toFixed(1);
        }
        if (i !== index) {
            const range = document.querySelector(`#card-${i} [data-field="${field}"]`);
            if (range) range.value = value;
        }
    }
}

function addSound(emoteIndex) {
    emotes[emoteIndex].sounds.push({ name: "", data: "", audioElement: null, isPlaying: false });
    renderEmotes();
}

function removeSound(emoteIndex, soundIndex) {
    const sound = emotes[emoteIndex].sounds[soundIndex];
    if (sound.audioElement) {
        sound.audioElement.pause();
        sound.audioElement = null;
    }
    emotes[emoteIndex].sounds.splice(soundIndex, 1);
    renderEmotes();
}

async function updateSound(emoteIndex, soundIndex, file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        emotes[emoteIndex].sounds[soundIndex] = {
            name: file.name,
            data: e.target.result,
            audioElement: new Audio(e.target.result),
            isPlaying: false
        };
        renderEmotes();
    };
    reader.readAsDataURL(file);
}

function togglePlay(emoteIndex, soundIndex) {
    const sound = emotes[emoteIndex].sounds[soundIndex];
    const emote = emotes[emoteIndex];

    if (!sound.audioElement && sound.data) {
        sound.audioElement = new Audio(sound.data);
    }

    if (!sound.audioElement) {
        console.error("no soundfile available for", sound.name);
        return;
    }

    if (sound.isPlaying) {
        sound.audioElement.pause();
        sound.isPlaying = false;
        renderEmotes();
    } else {
        sound.audioElement.volume = emote.volume;
        sound.audioElement.playbackRate = Math.random() * (emote.speedMax - emote.speedMin) + emote.speedMin;
        sound.audioElement.play().then(() => {
            sound.isPlaying = true;
            renderEmotes();
        }).catch(err => {
            sound.isPlaying = false;
            renderEmotes();
        });
        sound.audioElement.onended = () => {
            sound.isPlaying = false;
            renderEmotes();
        };
    }
}

async function loadHTML(file) {
    if (!file) return;

    showLoading('loading preset', 'reading file: ' + file.name, 10, 'parsing...');

    const reader = new FileReader();
    reader.onload = function (e) {
        const htmlContent = e.target.result;

        updateLoading('reading settings...', 30);

        const channelMatch = htmlContent.match(/const CHANNEL="([^"]+)"/);
        if (channelMatch) {
            document.getElementById("channelName").value = channelMatch[1];
        }

        const streakPosMatch = htmlContent.match(/const STREAK_POSITION="([^"]+)"/);
        if (streakPosMatch) {
            const sel = document.getElementById("streakPosition");
            if (sel) sel.value = streakPosMatch[1];
        }

        const limitMatch = htmlContent.match(/const LIMIT_STREAK_TO_SOUNDS=(true|false)/);
        if (limitMatch) {
            const cb = document.getElementById("limitStreakToSounds");
            if (cb) cb.checked = limitMatch[1] === "true";
        }

        updateLoading('loading emote config...', 55);

        const configMatch = htmlContent.match(/const config=(\{.*?\});/s);
        if (configMatch) {
            try {
                const config = JSON.parse(configMatch[1]);
                emotes = [];

                const emoteEntries = Object.entries(config.emotes);
                emoteEntries.forEach(([emoteName, emoteData], i) => {
                    emotes.push({
                        name: emoteName,
                        minStreak: emoteData.min_streak,
                        volume: emoteData.volume,
                        speedMin: emoteData.speed.min,
                        speedMax: emoteData.speed.max,
                        sounds: emoteData.sounds.map((data, index) => ({
                            name: `sound${index + 1}`,
                            data: data,
                            audioElement: new Audio(data),
                            isPlaying: false
                        }))
                    });
                    if (i % 3 === 0) updateLoading('loading emotes... (' + (i+1) + '/' + emoteEntries.length + ')', 55 + Math.floor((i / emoteEntries.length) * 35));
                });

                updateLoading('rendering...', 95, emotes.length + ' emotes loaded');
                renderEmotes();
                hideLoading();
                const ch = document.getElementById("channelName").value.trim();
                if (ch) { setTimeout(() => fetchChannelEmotes(), 300); }
            } catch (err) {
                hideLoading();
                alert("error parsing config");
                console.error(err);
            }
        } else {
            hideLoading();
        }
    };
    reader.onerror = () => hideLoading();
    reader.readAsText(file);
}

async function generateHTML() {
    const channelName = document.getElementById("channelName").value.trim();

    if (!channelName) {
        alert("no channel name given");
        return;
    }

    const streakPosition = document.getElementById("streakPosition").value;
    const limitStreakToSounds = document.getElementById("limitStreakToSounds").checked;

    const configObj = {};
    for (const emote of emotes) {
        if (!emote.name) continue;

        configObj[emote.name] = {
            speed: {
                max: emote.speedMax,
                min: emote.speedMin
            },
            min_streak: emote.minStreak,
            sounds: emote.sounds.map(s => s.data).filter(d => d),
            volume: emote.volume
        };
    }

    const streakPositionCSS = {
        "none": "",
        "top-left": "top:5vh;left:5vw;",
        "top-right": "top:5vh;right:5vw;",
        "center-left": "top:50%;left:5vw;transform:translateY(-50%);",
        "center-right": "top:50%;right:5vw;transform:translateY(-50%);",
        "bottom-left": "bottom:5vh;left:5vw;",
        "bottom-right": "bottom:5vh;right:5vw;",
    };

    const streakCSS = streakPositionCSS[streakPosition] || "";
    const streakEnabled = streakPosition !== "none";


    const streakOverlayBlock = streakEnabled ? [
        "const STREAK_OVERLAY_ENABLED=true;",
        "const STREAK_POSITION=\"" + streakPosition + "\";",
        "const LIMIT_STREAK_TO_SOUNDS=" + (limitStreakToSounds ? "true" : "false") + ";",
        "let emoteList=[];",
        "let streakDisplay={emote:'',count:0,url:'',hideTimer:null};",
        "let allStreaks={};",
        "const overlayEl=document.getElementById('streak-overlay');",
        "async function loadEmotes(){",
        "  const proxy='https://api.roaringiron.com/proxy/';",
        "  try{",
        "    const idRes=await fetch(proxy+'https://api.ivr.fi/v2/twitch/user?login='+CHANNEL,{headers:{'User-Agent':'emote-sounds-overlay'}});",
        "    const idData=await idRes.json();",
        "    const twitchId=idData?.[0]?.id;",
        "    if(!twitchId)return;",
        "    const add=(name,url)=>emoteList.push({name,url});",
        "    await fetch(proxy+'https://api.frankerfacez.com/v1/room/'+CHANNEL).then(r=>r.json()).then(d=>{for(const k of Object.keys(d.sets||{}))for(const e of d.sets[k].emoticons)add(e.name,'https://'+(e.urls['2']||e.urls['1']).split('//').pop())}).catch(()=>{});",
        "    await fetch(proxy+'https://api.frankerfacez.com/v1/set/global').then(r=>r.json()).then(d=>{for(const k of Object.keys(d.sets||{}))for(const e of d.sets[k].emoticons)add(e.name,'https://'+(e.urls['2']||e.urls['1']).split('//').pop())}).catch(()=>{});",
        "    await fetch(proxy+'https://api.betterttv.net/3/cached/users/twitch/'+twitchId).then(r=>r.json()).then(d=>{[...(d.channelEmotes||[]),...(d.sharedEmotes||[])].forEach(e=>add(e.code,'https://cdn.betterttv.net/emote/'+e.id+'/2x'))}).catch(()=>{});",
        "    await fetch(proxy+'https://api.betterttv.net/3/cached/emotes/global').then(r=>r.json()).then(d=>{(d||[]).forEach(e=>add(e.code,'https://cdn.betterttv.net/emote/'+e.id+'/2x'))}).catch(()=>{});",
        "    await fetch(proxy+'https://7tv.io/v3/emote-sets/global').then(r=>r.json()).then(d=>{(d.emotes||[]).forEach(e=>add(e.name,'https://cdn.7tv.app/emote/'+e.id+'/2x.webp'))}).catch(()=>{});",
        "    await fetch(proxy+'https://7tv.io/v3/users/twitch/'+twitchId).then(r=>r.json()).then(d=>{const es=d?.emote_set?.emotes||[];es.forEach(e=>add(e.name,'https:'+e.data.host.url+'/'+e.data.host.files[2]?.name))}).catch(()=>{});",
        "    log('loaded '+emoteList.length+' emotes for streak overlay','system');",
        "  }catch(err){log('emote load error: '+err.message,'system');}",
        "}",
        "function getEmoteUrl(name){",
        "  const found=emoteList.find(e=>e.name===name);",
        "  return found?found.url:null;",
        "}",
        "function showStreakOverlay(emoteName,count,url){",
        "  if(!url)return;",
        "  if(streakDisplay.hideTimer)clearTimeout(streakDisplay.hideTimer);",
        "  overlayEl.innerHTML='';",
        "  const img=document.createElement('img');",
        "  img.src=url;",
        "  img.style.cssText='width:56px;height:56px;object-fit:contain;image-rendering:pixelated;';",
        "  const label=document.createElement('span');",
        "  label.textContent=' x'+count;",
        "  label.style.cssText='font-size:28px;font-weight:bold;color:#fff;text-shadow:0 0 6px #000,0 0 12px #000;vertical-align:middle;white-space:nowrap;';",
        "  overlayEl.appendChild(img);",
        "  overlayEl.appendChild(label);",
        "  overlayEl.style.opacity='1';",
        "  overlayEl.style.transform='scale(1)';",
        "  streakDisplay.hideTimer=setTimeout(()=>{",
        "    overlayEl.style.opacity='0';",
        "    overlayEl.style.transform='scale(0.85)';",
        "  },4000);",
        "}",
    ].join("\n") : [
        "const STREAK_OVERLAY_ENABLED=false;",
        "const STREAK_POSITION=\"none\";",
        "const LIMIT_STREAK_TO_SOUNDS=true;",
        "async function loadEmotes(){}",
        "function getEmoteUrl(name){return null;}",
        "function showStreakOverlay(){}",
    ].join("\n");

    const overlayElementHTML = streakEnabled
        ? "<div id=\"streak-overlay\" style=\"position:fixed;" + streakCSS + "display:flex;align-items:center;gap:10px;padding:10px 18px;background:rgba(0,0,0,0.55);border-radius:0px;opacity:0;transform:scale(0.85);transition:opacity 0.25s,transform 0.25s;pointer-events:none;\"></div>"
        : "";

    const handleMessageFn = [
        "function handleMessage(message){",
        "log(message,\"message\");",
        "const messageLower=message.toLowerCase().trim();",
        "const firstWord=messageLower.split(/\\s+/)[0];",
        "let matchedEmote=null;",
        "for(const emote in config.emotes){if(firstWord===emote.toLowerCase()){matchedEmote=emote;break}}",
        "if(matchedEmote){",
        "  streaks[matchedEmote]=(streaks[matchedEmote]||0)+1;",
        "  for(const emote in config.emotes){if(emote!==matchedEmote){if(streaks[emote]>0){log('streak reset: '+emote,'streak')}streaks[emote]=0}}",
        "  const emoteConfig=config.emotes[matchedEmote];",
        "  const streakCount=streaks[matchedEmote];",
        "  log('streak: '+matchedEmote+' = '+streakCount+'/'+emoteConfig.min_streak,'streak');",
        "  if(streakCount>=emoteConfig.min_streak){",
        "    log('streak reached for '+matchedEmote,'streak');",
        "    playSound(matchedEmote);",
        "    if(STREAK_OVERLAY_ENABLED){",
        "      const url=getEmoteUrl(matchedEmote);",
        "      showStreakOverlay(matchedEmote,streakCount,url);",
        "    }",
        "  }",
        "  if(STREAK_OVERLAY_ENABLED&&!LIMIT_STREAK_TO_SOUNDS){",
        "    for(const k in allStreaks){if(k!==firstWord)allStreaks[k]=0;}",
        "  }",
        "}else if(STREAK_OVERLAY_ENABLED&&!LIMIT_STREAK_TO_SOUNDS){",
        "  const fetchedMatch=emoteList.find(e=>e.name.toLowerCase()===firstWord);",
        "  if(fetchedMatch){",
        "    for(const k in allStreaks){if(k!==fetchedMatch.name)allStreaks[k]=0;}",
        "    allStreaks[fetchedMatch.name]=(allStreaks[fetchedMatch.name]||0)+1;",
        "    const minStreak=5;",
        "    if(allStreaks[fetchedMatch.name]>=minStreak){",
        "      showStreakOverlay(fetchedMatch.name,allStreaks[fetchedMatch.name],fetchedMatch.url);",
        "    }",
        "  }else{",
        "    let anyReset=false;",
        "    for(const emote in config.emotes){if(streaks[emote]>0){anyReset=true}streaks[emote]=0}",
        "    for(const k in allStreaks){allStreaks[k]=0;}",
        "    if(anyReset){log('streaks reset','streak')}",
        "  }",
        "}else{",
        "  let anyReset=false;",
        "  for(const emote in config.emotes){if(streaks[emote]>0){anyReset=true}streaks[emote]=0}",
        "  if(anyReset){log('streaks reset','streak')}",
        "}}"
    ].join("");

    const htmlTemplate = [
        "<!DOCTYPE html>",
        "<html lang=\"en\">",
        "<head>",
        "<meta charset=\"UTF-8\">",
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
        "<title>twitch emote sounds</title>",
        "<style>",
        "body{margin:0;padding:20px;font-family:monospace;background:none;color:#0f0}",
        "#debug{max-width:800px;margin:0 auto}",
        ".log-entry{padding:5px;border-bottom:1px solid #333}",
        ".log-system{color:#0ff}",
        ".log-message{color:#fff}",
        ".log-streak{color:#ff0}",
        ".log-sound{color:#f0f;font-weight:bold}",
        "</style>",
        "</head>",
        "<body>",
        overlayElementHTML,
        "<div id=\"debug\" style=\"display: none;\"></div>",
        "<script>",
        "const CHANNEL=\"" + channelName + "\";",
        "const urlParams=new URLSearchParams(window.location.search);",
        "const DEBUG=urlParams.get(\"debug\")===\"true\";",
        "if(DEBUG){document.getElementById(\"debug\").style.display=\"block\"}",
        "function log(message,type=\"system\"){console.log(message);if(DEBUG){const debugDiv=document.getElementById(\"debug\");const entry=document.createElement(\"div\");entry.className=\"log-entry log-\"+type;const timestamp=new Date().toLocaleTimeString();entry.textContent=\"[\"+timestamp+\"] \"+message;debugDiv.appendChild(entry);debugDiv.scrollTop=debugDiv.scrollHeight;while(debugDiv.children.length>100){debugDiv.removeChild(debugDiv.firstChild)}}}",
        "const config=" + JSON.stringify({ emotes: configObj }) + ";",
        "let ws=null;",
        "let streaks={};",
        streakOverlayBlock,
        "function getRandomElement(arr){return arr[Math.floor(Math.random()*arr.length)]}",
        "function getRandomSpeed(min,max){return Math.random()*(max-min)+min}",
        "async function playSound(emote){const emoteConfig=config.emotes[emote];const sound=getRandomElement(emoteConfig.sounds);const speed=getRandomSpeed(emoteConfig.speed.min,emoteConfig.speed.max);log(\"playing sound: \"+sound.substring(0,30)+\"... speed: \"+speed.toFixed(2)+\"x\",\"sound\");const audio=new Audio(sound);audio.volume=emoteConfig.volume;audio.playbackRate=speed;try{await audio.play()}catch(err){log(\"error playing sound: \"+err.message,\"system\");console.error(\"error playing sound:\",err)}}",
        handleMessageFn,
        "function connect(){for(const emote in config.emotes){streaks[emote]=0}for(const k in allStreaks){allStreaks[k]=0;}log(\"connecting to #\"+CHANNEL+\"...\",\"system\");ws=new WebSocket(\"wss://irc-ws.chat.twitch.tv:443\");ws.onopen=()=>{ws.send(\"CAP REQ :twitch.tv/tags twitch.tv/commands\");ws.send(\"NICK justinfan44\");ws.send(\"JOIN #\"+CHANNEL);log(\"connected to #\"+CHANNEL,\"system\");loadEmotes()};ws.onmessage=(event)=>{const messages=event.data.split(\"\\r\\n\");messages.forEach(msg=>{if(msg.startsWith(\"PING\")){ws.send(\"PONG :tmi.twitch.tv\")}else if(msg.includes(\"PRIVMSG\")){const parts=msg.split(\"PRIVMSG\");if(parts.length>1){const message=parts[1].split(\":\").slice(1).join(\":\").trim();handleMessage(message)}}})};ws.onerror=(error)=>{log(\"connection error: \"+error,\"system\");console.error(\"connection error:\",error)}}",
        "window.addEventListener(\"load\",connect);",
        "<" + "/script>",
        "</body>",
        "</html>"
    ].join("\n");

    const blob = new Blob([htmlTemplate], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "twitch-emote-sounds-" + channelName + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function removeAllSounds() {
    if (emotes.length === 0) return;
    emotes = [];
    renderEmotes();
}

const barElement = document.getElementById("loadingBar") || document.querySelector(".cfg-loading");

barElement.classList.add('script-loaded');

showLoading('emote sounds configurator', 'loading default emotes...', 20, 'initialising...');

setTimeout(() => {
    updateLoading('building emote cards...', 65, (typeof emotes !== 'undefined' ? emotes.length : 0) + ' emotes found');
    setTimeout(() => {
        renderEmotes();
        barElement.style.display = "none";
        updateLoading('ready!', 99);
        hideLoading();
    }, 120);
}, 350 + 200);