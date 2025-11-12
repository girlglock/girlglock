let emotes = [
    {
        name: "otag",
        minStreak: 4,
        volume: 1.0,
        speedMin: 0.5,
        speedMax: 2.0,
        sounds: []
    }
];

function renderEmotes() {
    const list = document.getElementById("emoteList");
    list.innerHTML = "";

    emotes.forEach((emote, index) => {
        const card = document.createElement("div");
        card.className = "emote-card";
        card.innerHTML = `  
            <div class="form-group" style="display: flex; flex-direction: column; gap: 4px;">
              <label>Emote name</label>
              <div style="display: flex; align-items: center;">
                <input 
                  class="cs-input" 
                  type="text" 
                  value="${emote.name}" 
                  onchange="updateEmote(${index}, 'name', this.value)" 
                  style="flex: 1; margin-right: 8px;"
                >
                <button 
                  class="cs-btn btn-small" 
                  style="background-color: rgb(255, 79, 79); color: white; padding: 6px 10px; max-height: 25px;"
                  onclick="removeEmote(${index})"
                >
                  delete
                </button>
              </div>
            </div>
            <hr class="cs-hr" style="border-color: var(--border-light); margin: 20px 0;">
            <div class="form-group">
                <label>required streak</label>
                <input class="cs-input" type="number" value="${emote.minStreak}" min="1" step="1" onchange="updateEmote(${index}, 'minStreak', parseInt(this.value))">
            </div>
            <hr class="cs-hr" style="border-color: var(--border-light); margin: 20px 0;">
            <div class="input-row">
                <div style="flex: 1;">
                    <div class="cs-slider">
                        <div class="value">
                            <p>0.1</p>
                            <p>5.0</p>
                        </div>
                        <div class="cs-ruler"></div>
                        <input type="range" min="0.1" max="5" step="0.1" value="${emote.speedMin}" oninput="updateEmoteAndDisplay(${index}, 'speedMin', parseFloat(this.value), this)">
                        <label id="speedMin-label-${index}">min speed - ${emote.speedMin.toFixed(1)}</label>
                    </div>
                </div>
                <div style="flex: 1;">
                    <div class="cs-slider">
                        <div class="value">
                            <p>0.1</p>
                            <p>5.0</p>
                        </div>
                        <div class="cs-ruler"></div>
                        <input type="range" min="0.1" max="5" step="0.1" value="${emote.speedMax}" oninput="updateEmoteAndDisplay(${index}, 'speedMax', parseFloat(this.value), this)">
                        <label id="speedMax-label-${index}">max speed - ${emote.speedMax.toFixed(1)}</label>
                    </div>
                </div>
                                        <div style="flex: 1;">
                    <div class="cs-slider">
                        <div class="value">
                            <p>0.0</p>
                            <p>1.0</p>
                        </div>
                        <div class="cs-ruler"></div>
                        <input type="range" min="0" max="1" step="0.025" value="${emote.volume}" oninput="updateEmoteAndDisplay(${index}, 'volume', parseFloat(this.value), this)">
                        <label id="volume-label-${index}">volume - ${emote.volume.toFixed(3)}</label>
                    </div>
                </div>
            </div>
            <hr class="cs-hr" style="border-color: var(--border-light); margin: 20px 0;">
            <div class="form-group">
                <label>sound files</label>
                <div id="soundList${index}">
                    ${emote.sounds.map((sound, sIndex) => `
                        ${sIndex > 0 ? '<hr class="cs-hr" style="margin: 10px 0;">' : ""}
                        <div class="sound-item">
                            <label class="cs-btn btn-small">choose file<input type="file" accept="audio/*" onchange="updateSound(${index}, ${sIndex}, this.files[0])" hidden></label>
                            <div class="file-name">${sound.name || "no file selected"}</div>
                            <button class="cs-btn btn-small" onclick="removeSound(${index}, ${sIndex})">x</button>
                        </div>
                    `).join("")}
                </div>
                <button class="cs-btn btn-small" onclick="addSound(${index})" style="margin-top: 5px;">+ add sound</button>
            </div>
        `;
        list.appendChild(card);
    });
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
    renderEmotes();
}

function updateEmote(index, field, value) {
    emotes[index][field] = value;
}

function updateEmoteAndDisplay(index, field, value, element) {
    emotes[index][field] = value;
    const labelElement = document.getElementById(`${field}-label-${index}`);
    if (labelElement) {
        if (field === "volume") {
            labelElement.textContent = `volume - ${value.toFixed(3)}`;
        } else if (field === "speedMin") {
            labelElement.textContent = `min speed - ${value.toFixed(1)}`;
        } else if (field === "speedMax") {
            labelElement.textContent = `max speed - ${value.toFixed(1)}`;
        }
    }
}

function addSound(emoteIndex) {
    emotes[emoteIndex].sounds.push({ name: "", data: "" });
    renderEmotes();
}

function removeSound(emoteIndex, soundIndex) {
    emotes[emoteIndex].sounds.splice(soundIndex, 1);
    renderEmotes();
}

async function updateSound(emoteIndex, soundIndex, file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        emotes[emoteIndex].sounds[soundIndex] = {
            name: file.name,
            data: e.target.result
        };
        renderEmotes();
    };
    reader.readAsDataURL(file);
}

async function loadHTML(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const htmlContent = e.target.result;
        
        const channelMatch = htmlContent.match(/const CHANNEL="([^"]+)"/);
        if (channelMatch) {
            document.getElementById("channelName").value = channelMatch[1];
        }

        const configMatch = htmlContent.match(/const config=(\{.*?\});/s);
        if (configMatch) {
            try {
                const config = JSON.parse(configMatch[1]);
                emotes = [];
                
                for (const [emoteName, emoteData] of Object.entries(config.emotes)) {
                    emotes.push({
                        name: emoteName,
                        minStreak: emoteData.min_streak,
                        volume: emoteData.volume,
                        speedMin: emoteData.speed.min,
                        speedMax: emoteData.speed.max,
                        sounds: emoteData.sounds.map((data, index) => ({
                            name: `sound${index + 1}`,
                            data: data
                        }))
                    });
                }
                
                renderEmotes();
            } catch (err) {
                alert("error parsing config");
                console.error(err);
            }
        }
    };
    reader.readAsText(file);
}

async function generateHTML() {
    const channelName = document.getElementById("channelName").value.trim();

    if (!channelName) {
        alert("no channel name given");
        return;
    }

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
        "<div id=\"debug\" style=\"display: none;\"></div>",
        "<script>",
        "let audioUnlocked=true;",
        "const CHANNEL=\"" + channelName + "\";",
        "const urlParams=new URLSearchParams(window.location.search);",
        "const DEBUG=urlParams.get(\"debug\")===\"true\";",
        "if(DEBUG){document.getElementById(\"debug\").style.display=\"block\"}",
        "function log(message,type=\"system\"){console.log(message);if(DEBUG){const debugDiv=document.getElementById(\"debug\");const entry=document.createElement(\"div\");entry.className=\"log-entry log-\"+type;const timestamp=new Date().toLocaleTimeString();entry.textContent=\"[\"+timestamp+\"] \"+message;debugDiv.appendChild(entry);debugDiv.scrollTop=debugDiv.scrollHeight;while(debugDiv.children.length>100){debugDiv.removeChild(debugDiv.firstChild)}}}",
        "const config=" + JSON.stringify({ emotes: configObj }) + ";",
        "let ws=null;",
        "let streaks={};",
        "function getRandomElement(arr){return arr[Math.floor(Math.random()*arr.length)]}",
        "function getRandomSpeed(min,max){return Math.random()*(max-min)+min}",
        "async function playSound(emote){const emoteConfig=config.emotes[emote];const sound=getRandomElement(emoteConfig.sounds);const speed=getRandomSpeed(emoteConfig.speed.min,emoteConfig.speed.max);log(\"playing sound: \"+sound.substring(0,30)+\"... speed: \"+speed.toFixed(2)+\"x\",\"sound\");const audio=new Audio(sound);audio.volume=emoteConfig.volume;audio.playbackRate=speed;try{await audio.play();streaks[emote]=0}catch(err){log(\"error playing sound: \"+err.message,\"system\");console.error(\"error playing sound:\",err)}}",
        "function handleMessage(message){log(message,\"message\");const messageLower=message.toLowerCase().trim();const firstWord=messageLower.split(/\\s+/)[0];let matchedEmote=null;for(const emote in config.emotes){if(firstWord===emote.toLowerCase()){matchedEmote=emote;break}}if(matchedEmote){streaks[matchedEmote]=(streaks[matchedEmote]||0)+1;for(const emote in config.emotes){if(emote!==matchedEmote){if(streaks[emote]>0){log(\"streak reset: \"+emote,\"streak\")}streaks[emote]=0}}const emoteConfig=config.emotes[matchedEmote];const streakCount=streaks[matchedEmote];log(\"streak: \"+matchedEmote+\" = \"+streakCount+\"/\"+emoteConfig.min_streak,\"streak\");if(streakCount>=emoteConfig.min_streak){log(\"streak reached for \"+matchedEmote,\"streak\");playSound(matchedEmote)}}else{let anyReset=false;for(const emote in config.emotes){if(streaks[emote]>0){anyReset=true}streaks[emote]=0}if(anyReset){log(\"streaks reset\",\"streak\")}}}",
        "function connect(){for(const emote in config.emotes){streaks[emote]=0}log(\"connecting to #\"+CHANNEL+\"...\",\"system\");ws=new WebSocket(\"wss://irc-ws.chat.twitch.tv:443\");ws.onopen=()=>{ws.send(\"CAP REQ :twitch.tv/tags twitch.tv/commands\");ws.send(\"NICK justinfan44\");ws.send(\"JOIN #\"+CHANNEL);log(\"connected to #\"+CHANNEL,\"system\");console.log(\"connected to #\"+CHANNEL)};ws.onmessage=(event)=>{const messages=event.data.split(\"\\r\\n\");messages.forEach(msg=>{if(msg.startsWith(\"PING\")){ws.send(\"PONG :tmi.twitch.tv\")}else if(msg.includes(\"PRIVMSG\")){const parts=msg.split(\"PRIVMSG\");if(parts.length>1){const message=parts[1].split(\":\").slice(1).join(\":\").trim();handleMessage(message)}}})};ws.onerror=(error)=>{log(\"connection error: \"+error,\"system\");console.error(\"connection error:\",error)}}",
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

renderEmotes();