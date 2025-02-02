 
const initTimestamp = Date.now();
const urlParams = new URLSearchParams(window.location.search);

const vowelFreq = {
    'a': JSON.parse(urlParams.get("aFreq") || '[600, 750]'),
    'e': JSON.parse(urlParams.get("eFreq") || '[400, 2300]'),
    'i': JSON.parse(urlParams.get("iFreq") || '[100, 300]'),
    'o': JSON.parse(urlParams.get("oFreq") || '[400, 600]'),
    'u': JSON.parse(urlParams.get("uFreq") || '[280, 380]')
};

const threshold = parseInt(urlParams.get("threshold")) || 1000;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        document.body.innerHTML = `
            <img id="mouth-image" src="loading.png">
            <div id="debug-stats">
                <p>state: <span id="state">initializing...</span></p>
                <p>amp: <span id="amplitude">0</span></p>
                <p>freq: <span id="frequency">0</span> Hz</p>
            </div>

            <button id="toggleSettings">settings</button>
            <div id="settings" style="display: none;">
                <br>
                <label>Local assets folder path:</label>
                <input type="text" id="folder-path" value="" placeholder="C:/cool-cat-files">
                <p><em>the required files in this dir are "silent.png", "a.png", "e.png", "i.png", "o.png", "u.png", "speaking.png" and "loading.png".</em></p>
                <br>
                <br>
                <label>"a" freq range:</label>
                <div class="slider-container">
                    <input type="range" id="aFreqLow" min="0" max="2000" value="600" class="slider">
                    <input type="range" id="aFreqHigh" min="0" max="2000" value="750" class="slider">
                    <span id="aFreqRangeText">600 - 750</span>
                </div>
                <br>
                <label>"e" freq range:</label>
                <div class="slider-container">
                    <input type="range" id="eFreqLow" min="0" max="3000" value="400" class="slider">
                    <input type="range" id="eFreqHigh" min="0" max="3000" value="2300" class="slider">
                    <span id="eFreqRangeText">400 - 2300</span>
                </div>
                <br>
                <label>"i" freq range:</label>
                <div class="slider-container">
                    <input type="range" id="iFreqLow" min="0" max="1000" value="100" class="slider">
                    <input type="range" id="iFreqHigh" min="0" max="1000" value="300" class="slider">
                    <span id="iFreqRangeText">100 - 300</span>
                </div>
                <br>
                <label>"o" freq range:</label>
                <div class="slider-container">
                    <input type="range" id="oFreqLow" min="0" max="2000" value="400" class="slider">
                    <input type="range" id="oFreqHigh" min="0" max="2000" value="600" class="slider">
                    <span id="oFreqRangeText">400 - 600</span>
                </div>
                <br>
                <label>"u" freq range:</label>
                <div class="slider-container">
                    <input type="range" id="uFreqLow" min="0" max="1000" value="280" class="slider">
                    <input type="range" id="uFreqHigh" min="0" max="1000" value="380" class="slider">
                    <span id="uFreqRangeText">280 - 380</span>
                </div>
                <br>
                <br>
                <label>amp threshold:</label>
                <input type="number" id="threshold" value="1000">
                <br>
                <br>
                <button type="button" onclick="generateURL()">get settings url</button><br>
                <textarea id="generated-url" readonly rows="1"></textarea>
                <p><em>copy this to use in OBS and don't forget to add <code>--use-fake-ui-for-media-stream</code> to your OBS launch params in order to grant mic access</em></p>
                <p><em>you can just simply crop out the stats and the button in obs too :3c</em></p>
            </div>
        `;

        const mouthImage = document.getElementById('mouth-image');
        const ampElement = document.getElementById('amplitude');
        const freqElement = document.getElementById('frequency');
        const stateElement = document.getElementById('state');

        const audioContext = new AudioContext();
        const anal = audioContext.createAnalyser();
        const mic = audioContext.createMediaStreamSource(stream);
        mic.connect(anal);

        anal.fftSize = 1024;
        const bufferLength = anal.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let isInit = false;

        const detectVowel = () => {
            anal.getByteFrequencyData(dataArray);

            const totalAmplitude = dataArray.reduce((sum, value) => sum + value, 0);

            let maxAmplitude = 0;
            let dominantFrequency = 0;
            for (let i = 0; i < bufferLength; i++) {
                if (dataArray[i] > maxAmplitude) {
                    maxAmplitude = dataArray[i];
                    dominantFrequency = i * (audioContext.sampleRate / anal.fftSize);
                }
            }

            let state = 'silent';
            if (totalAmplitude >= threshold) {
                state = 'speaking';
                for (const [vowel, [low, high]] of Object.entries(vowelFreq)) {
                    if (dominantFrequency >= low && dominantFrequency <= high) {
                        state = vowel;
                        if (initTimestamp + 25000 < Date.now()) isInit = true;
                        break;
                    }
                }
            }

            return { state, totalAmplitude, dominantFrequency };
        };

        const folderPath = urlParams.get("folderPath") ? decodeURIComponent(urlParams.get("folderPath")) : "images";
        const update = () => {
            const { state, totalAmplitude, dominantFrequency } = detectVowel();

            stateElement.textContent = isInit ? state : "initializing...";
            if (isInit) {
                ampElement.textContent = totalAmplitude.toFixed(2);
                freqElement.textContent = dominantFrequency.toFixed(2);
                mouthImage.src = `${folderPath}/${state}.png`;
            }
            else {
                mouthImage.src = `${folderPath}/loading.png`;
            }
            
            requestAnimationFrame(update);
        };

        update();

        document.getElementById("aFreqLow").addEventListener("input", updateRangeText);
        document.getElementById("aFreqHigh").addEventListener("input", updateRangeText);
        document.getElementById("eFreqLow").addEventListener("input", updateRangeText);
        document.getElementById("eFreqHigh").addEventListener("input", updateRangeText);
        document.getElementById("iFreqLow").addEventListener("input", updateRangeText);
        document.getElementById("iFreqHigh").addEventListener("input", updateRangeText);
        document.getElementById("oFreqLow").addEventListener("input", updateRangeText);
        document.getElementById("oFreqHigh").addEventListener("input", updateRangeText);
        document.getElementById("uFreqLow").addEventListener("input", updateRangeText);
        document.getElementById("uFreqHigh").addEventListener("input", updateRangeText);

        function updateRangeText() {
            document.getElementById("aFreqRangeText").textContent = `${document.getElementById("aFreqLow").value} - ${document.getElementById("aFreqHigh").value}`;
            document.getElementById("eFreqRangeText").textContent = `${document.getElementById("eFreqLow").value} - ${document.getElementById("eFreqHigh").value}`;
            document.getElementById("iFreqRangeText").textContent = `${document.getElementById("iFreqLow").value} - ${document.getElementById("iFreqHigh").value}`;
            document.getElementById("oFreqRangeText").textContent = `${document.getElementById("oFreqLow").value} - ${document.getElementById("oFreqHigh").value}`;
            document.getElementById("uFreqRangeText").textContent = `${document.getElementById("uFreqLow").value} - ${document.getElementById("uFreqHigh").value}`;
        }

        const toggleSettingsButton = document.getElementById('toggleSettings');
        const settingsDiv = document.getElementById('settings');

        toggleSettingsButton.addEventListener('click', () => {
            if (settingsDiv.style.display === 'none' || settingsDiv.style.display === '') {
                settingsDiv.style.display = 'block';
            } else {
                settingsDiv.style.display = 'none';
            }
        });
    })
    .catch(() => {
        document.getElementById("status").textContent = "mic access denied";
    });

function generateURL() {
    let folderPath = document.getElementById("folder-path").value;
    folderPath = folderPath.replace(/\\/g, '/');

    const aFreqLow = document.getElementById("aFreqLow").value;
    const aFreqHigh = document.getElementById("aFreqHigh").value;
    const eFreqLow = document.getElementById("eFreqLow").value;
    const eFreqHigh = document.getElementById("eFreqHigh").value;
    const iFreqLow = document.getElementById("iFreqLow").value;
    const iFreqHigh = document.getElementById("iFreqHigh").value;
    const oFreqLow = document.getElementById("oFreqLow").value;
    const oFreqHigh = document.getElementById("oFreqHigh").value;
    const uFreqLow = document.getElementById("uFreqLow").value;
    const uFreqHigh = document.getElementById("uFreqHigh").value;

    const threshold = document.getElementById("threshold").value;

    const baseURL = window.location.href.split('?')[0];

    let generatedURL = `${baseURL}?threshold=${threshold}`;

    if (folderPath) generatedURL += `&folderPath=${encodeURIComponent(folderPath)}`;
    generatedURL += `&aFreq=[${aFreqLow},${aFreqHigh}]&eFreq=[${eFreqLow},${eFreqHigh}]&iFreq=[${iFreqLow},${iFreqHigh}]&oFreq=[${oFreqLow},${oFreqHigh}]&uFreq=[${uFreqLow},${uFreqHigh}]`;

    document.getElementById('generated-url').textContent = generatedURL;
}
