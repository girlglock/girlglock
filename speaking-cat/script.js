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
const folderPath = urlParams.get("folderPath") ? rawDogTheRepo(decodeURIComponent(urlParams.get("folderPath"))) : "images";
const cleanMode = urlParams.get('cleanMode') === 'true';

function rawDogTheRepo(url) {
    return url.replace('github.com', 'raw.githubusercontent.com') + '/main/';
}

document.querySelectorAll('#image-container img').forEach(img => {
    const id = img.id.replace('-image', '');
    img.src = `${folderPath}/${id}.png`;
});

document.addEventListener('DOMContentLoaded', () => {
    const settingsDiv = document.getElementById('settings');
    const toggleSettingsButton = document.getElementById('toggleSettings');
    
    initSlider('aFreqLow', vowelFreq.a[0]);
    initSlider('aFreqHigh', vowelFreq.a[1]);
    initSlider('eFreqLow', vowelFreq.e[0]);
    initSlider('eFreqHigh', vowelFreq.e[1]);
    initSlider('iFreqLow', vowelFreq.i[0]);
    initSlider('iFreqHigh', vowelFreq.i[1]);
    initSlider('oFreqLow', vowelFreq.o[0]);
    initSlider('oFreqHigh', vowelFreq.o[1]);
    initSlider('uFreqLow', vowelFreq.u[0]);
    initSlider('uFreqHigh', vowelFreq.u[1]);
    
    document.getElementById('threshold').value = threshold;
    updateRangeTexts();

    if (cleanMode) {
        document.getElementById('status').style.display = 'none';
        document.getElementById('debug-stats').style.display = 'none';
        document.getElementById('toggleSettings').style.display = 'none';
        document.getElementById('settings').style.display = 'none';
    }

    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', updateRangeTexts);
    });

    toggleSettingsButton.addEventListener('click', () => {
        settingsDiv.style.display = settingsDiv.style.display === 'none' ? 'block' : 'none';
    });
});

function initSlider(id, defaultValue) {
    const element = document.getElementById(id);
    const paramValue = urlParams.get(id);
    element.value = paramValue || defaultValue;
}

function updateRangeTexts() {
    document.getElementById('aFreqRangeText').textContent = 
        `${document.getElementById('aFreqLow').value} - ${document.getElementById('aFreqHigh').value}`;
    document.getElementById('eFreqRangeText').textContent = 
        `${document.getElementById('eFreqLow').value} - ${document.getElementById('eFreqHigh').value}`;
    document.getElementById('iFreqRangeText').textContent = 
        `${document.getElementById('iFreqLow').value} - ${document.getElementById('iFreqHigh').value}`;
    document.getElementById('oFreqRangeText').textContent = 
        `${document.getElementById('oFreqLow').value} - ${document.getElementById('oFreqHigh').value}`;
    document.getElementById('uFreqRangeText').textContent = 
        `${document.getElementById('uFreqLow').value} - ${document.getElementById('uFreqHigh').value}`;
}

navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        if (!cleanMode) {
            document.getElementById('status').textContent = 'mic ready :3';
        }
        
        const audioContext = new AudioContext();
        const anal = audioContext.createAnalyser();
        const mic = audioContext.createMediaStreamSource(stream);
        mic.connect(anal);

        anal.fftSize = 1024;
        const bufferLength = anal.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let isInit = false;

        function detectVowel() {
            anal.getByteFrequencyData(dataArray);
            const totalAmplitude = dataArray.reduce((a, b) => a + b, 0);
            
            let maxAmp = 0;
            let dominantFreq = 0;
            for (let i = 0; i < bufferLength; i++) {
                if (dataArray[i] > maxAmp) {
                    maxAmp = dataArray[i];
                    dominantFreq = i * (audioContext.sampleRate / anal.fftSize);
                }
            }

            let state = 'silent';
            if (totalAmplitude >= threshold) {
                state = 'speaking';
                for (const [vowel, [low, high]] of Object.entries(vowelFreq)) {
                    if (dominantFreq >= low && dominantFreq <= high) {
                        state = vowel;
                        if (Date.now() > initTimestamp + 25000) isInit = true;
                        break;
                    }
                }
            }

            return { 
                state, 
                totalAmplitude, 
                dominantFreq,
                isSpeaking: totalAmplitude >= threshold
            };
        }

        function update() {
            const { state, totalAmplitude, dominantFreq, isSpeaking } = detectVowel();
            const imageContainer = document.getElementById('image-container');
            
            if (isSpeaking) {
                imageContainer.classList.add('shaking');
            } else {
                imageContainer.classList.remove('shaking');
            }
            
            if (!cleanMode) {
                document.getElementById('state').textContent = isInit ? state : "initializing...";
                document.getElementById('amplitude').textContent = totalAmplitude.toFixed(0);
                document.getElementById('frequency').textContent = dominantFreq.toFixed(0);
            }

            document.querySelectorAll('#image-container img').forEach(img => {
                img.style.opacity = img.id === `${state}-image` ? 1 : 0;
            });

            if (!isInit) {
                document.getElementById('loading-image').style.opacity = 1;
            }

            requestAnimationFrame(update);
        }

        update();
    })
    .catch(() => {
        if (!cleanMode) {
            document.getElementById('status').textContent = 'mic access denied :c';
        }
    });

function generateURL() {
    const base = window.location.href.split('?')[0];
    const params = new URLSearchParams({
        threshold: document.getElementById('threshold').value,
        folderPath: document.getElementById('folder-path').value,
        aFreq: `[${document.getElementById('aFreqLow').value},${document.getElementById('aFreqHigh').value}]`,
        eFreq: `[${document.getElementById('eFreqLow').value},${document.getElementById('eFreqHigh').value}]`,
        iFreq: `[${document.getElementById('iFreqLow').value},${document.getElementById('iFreqHigh').value}]`,
        oFreq: `[${document.getElementById('oFreqLow').value},${document.getElementById('oFreqHigh').value}]`,
        uFreq: `[${document.getElementById('uFreqLow').value},${document.getElementById('uFreqHigh').value}]`,
        cleanMode: true
    });

    document.getElementById('generated-url').value = `${base}?${params}`;
}