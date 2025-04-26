let scene, camera, renderer;
let game = {
    render: {
        lastFrameTime: 0,
        frameInterval: 1000 / 30
    },
    stack: [],
    currentLayer: null,
    direction: new THREE.Vector3(1, 0, 0),
    speed: 0.3,
    boxHeight: 1,
    gameEnded: false,
    score: 0,
    multiplier: 1,
    axisToggle: false,
    cameraTargetY: 15,
    transitionDuration: 0.25,
    transitionStartTime: null,
    colors: [0xf6abb6, 0xdcd6f7, 0xa7c7e7],
    scoreHint: document.getElementById("scoreHint"),
    startHint: document.getElementById("startHint"),
    gameOverHint: document.getElementById("gameOverHint"),
    perfectCombos: 0,
    stats: {
        bestScore: 0,
        timesPlayed: 0,
        mostPerfectsInRow: 0
    }
};

const sounds = {
    place: new Audio('sounds/place.mp3'),
    gameover: new Audio('sounds/gameover.mp3'),
    perfect: new Audio('sounds/perfect.mp3')
};

function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play();
    }
}

init();
animate();

function init() {
    loadGameStats();

    var isMobile = new MobileDetect(window.navigator.userAgent);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(15, 13, 15);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        antialias: !isMobile.mobile(),
        alpha: !isMobile.mobile(),
        powerPreference: 'low-power',
        precision: isMobile.mobile() ? 'lowp' : 'highp'
    });

    if (isMobile.mobile()) {
        renderer.setPixelRatio(window.devicePixelRatio * 0.5);
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(10, 20, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const base = createSlab(0, 0, 5, 5);
    scene.add(base);
    game.stack.push(base);

    game.scoreHint.style.display = 'block';
    game.startHint.style.display = 'block';
    game.gameOverHint.style.display = 'none';

    addSlab();
}

function createSlab(x, y, width, depth) {
    const geometry = new THREE.BoxGeometry(width, game.boxHeight, depth);
    const material = new THREE.MeshLambertMaterial({ color: game.colors[game.stack.length % game.colors.length] });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, 0);
    return box;
}

function addSlab() {
    const lastLayer = game.stack[game.stack.length - 1];
    const width = lastLayer.scale.x * lastLayer.geometry.parameters.width;
    const depth = lastLayer.scale.z * lastLayer.geometry.parameters.depth;
    const y = game.boxHeight * game.stack.length;
    let x = lastLayer.position.x;
    let z = lastLayer.position.z;
    if (game.axisToggle) {
        z = -10;
    } else {
        x = -10;
    }

    const box = createSlab(x, y, width, depth);
    box.position.z = game.axisToggle ? -10 : lastLayer.position.z;
    box.position.x = game.axisToggle ? lastLayer.position.x : -10;
    box.moving = true;

    scene.add(box);
    game.currentLayer = box;

    game.direction = game.axisToggle
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(1, 0, 0);

    game.axisToggle = !game.axisToggle;
    game.speed += 0.005;

    if (game.stack.length > 1) game.startHint.style.display = "none";
}

function placeSlab() {
    const last = game.stack[game.stack.length - 1];
    const current = game.currentLayer;
    const lastBox = last.geometry.parameters;
    const currentBox = current.geometry.parameters;
    const lastSize = {
        x: lastBox.width * last.scale.x,
        z: lastBox.depth * last.scale.z
    };
    const currentSize = {
        x: currentBox.width * current.scale.x,
        z: currentBox.depth * current.scale.z
    };
    const deltaX = current.position.x - last.position.x;
    const deltaZ = current.position.z - last.position.z;
    const overlapX = lastSize.x - Math.abs(deltaX);
    const overlapZ = lastSize.z - Math.abs(deltaZ);

    if (overlapX <= 0 || overlapZ <= 0) {
        return gameOver();
    }

    const incomingArea = currentSize.x * currentSize.z;
    const overlapArea = overlapX * overlapZ;
    const overhangVolume = (incomingArea - overlapArea) * game.boxHeight;
    const perfectVolumeThreshold = 0.25;
    let wasPerfect = false;

    if (overhangVolume <= perfectVolumeThreshold) {
        wasPerfect = true;
        current.scale.x = lastSize.x / currentBox.width;
        current.scale.z = lastSize.z / currentBox.depth;
        current.position.x = last.position.x;
        current.position.z = last.position.z;
    } else {
        const sliceOverhang = (axis, delta, fullSize, overlapLen) => {
            const overhangLen = fullSize - overlapLen;
            if (overhangLen <= 0.01) return;
            const dir = delta > 0 ? 1 : -1;
            const geom = axis === 'x'
                ? new THREE.BoxGeometry(overhangLen, game.boxHeight, overlapZ)
                : new THREE.BoxGeometry(overlapX, game.boxHeight, overhangLen);
            const mat = current.material.clone();
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(current.position.x, current.position.y, current.position.z);
            mesh.position[axis] += dir * (overlapLen / 2 + overhangLen / 2);
            scene.add(mesh);
            new TWEEN.Tween(mesh.position)
                .to({ y: mesh.position.y - 10 }, 1000)
                .start()
                .onComplete(() => scene.remove(mesh));
        };

        sliceOverhang('x', deltaX, currentSize.x, overlapX);
        sliceOverhang('z', deltaZ, currentSize.z, overlapZ);

        current.scale.x = overlapX / currentBox.width;
        current.scale.z = overlapZ / currentBox.depth;

        current.position.x = last.position.x + deltaX / 2;
        current.position.z = last.position.z + deltaZ / 2;
    }

    current.moving = false;
    game.stack.push(current);
    game.currentLayer = null;

    if (wasPerfect) {
        playSound('perfect');
        game.perfectCombos++;
        game.multiplier++;
        game.score += 2 * game.multiplier;
    } else {
        game.perfectCombos = 0;
        game.multiplier = 1;
        game.score += game.multiplier;
        playSound('place');
    }

    game.scoreHint.textContent = `Score: ${game.score} (x${game.multiplier})`;
    game.cameraTargetY = camera.position.y + game.boxHeight;
    game.transitionStartTime = Date.now();

    addSlab();
}

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    if (currentTime - game.render.lastFrameTime < game.render.frameInterval) return;
    
    game.render.lastFrameTime = currentTime;
    
    if (game.currentLayer && game.currentLayer.moving && !game.gameEnded) {
        game.currentLayer.position.add(game.direction.clone().multiplyScalar(game.speed));
        const axisPos = game.direction.x !== 0 ? game.currentLayer.position.x : game.currentLayer.position.z;
        if (Math.abs(axisPos) > 10) game.direction.negate();
    }

    if (game.transitionStartTime !== null) {
        const elapsedTime = (Date.now() - game.transitionStartTime) / 1000;
        if (elapsedTime < game.transitionDuration) {
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, game.cameraTargetY, elapsedTime / game.transitionDuration);
        } else {
            camera.position.y = game.cameraTargetY;
            game.transitionStartTime = null;
        }
    }

    renderer.render(scene, camera);
    TWEEN.update();
}

function gameOver() {
    game.gameEnded = true;
    game.gameOverHint.style.display = 'block';
    playSound('gameover');
    updatePB();
    addMostPerfs();
}

function tryPlace() {
    if (game.gameEnded) { restartGame(); return; }
    if (!game.currentLayer) return;
    placeSlab();
}

function restartGame() {
    if (game.currentLayer) scene.remove(game.currentLayer);
    while (game.stack.length) scene.remove(game.stack.pop());
    game.currentLayer = null;
    game.speed = 0.3;
    game.gameEnded = false;
    game.score = 0;
    game.perfectCombos = 0;
    game.multiplier = 1;
    game.axisToggle = false;
    game.scoreHint.textContent = "Score: 0";
    game.scoreHint.style.display = 'block';
    game.startHint.style.display = 'block';
    game.gameOverHint.style.display = 'none';
    const base = createSlab(0, 0, 5, 5);
    scene.add(base);
    game.stack.push(base);
    camera.position.set(15, 13, 15);
    camera.lookAt(0, 0, 0);
    addSlab();
    addTimesPlayed();
}

function loadGameStats() {
    const storedStats = JSON.parse(localStorage.getItem('gameStats'));
    if (storedStats) {
        game.stats.bestScore = storedStats.bestScore || 0;
        game.stats.timesPlayed = storedStats.timesPlayed || 0;
        game.stats.mostPerfectsInRow = storedStats.mostPerfectsInRow || 0;
    }
    updateStatsDisplay();
}

function saveGameStats() {
    localStorage.setItem('gameStats', JSON.stringify(game.stats));
}

function updateStatsDisplay() {
    document.getElementById('bestScore').textContent = game.stats.bestScore;
    document.getElementById('timesPlayed').textContent = game.stats.timesPlayed;
    document.getElementById('mostPerfectsInARow').textContent = game.stats.mostPerfectsInRow;
}

function updatePB() {
    if (game.score > game.stats.bestScore) {
        game.stats.bestScore = game.score;
        saveGameStats();
    }
}

function addTimesPlayed() {
    game.stats.timesPlayed += 1;
    saveGameStats();
    updateStatsDisplay();
}

function addMostPerfs() {
    if (game.perfectCombos > game.stats.mostPerfectsInRow) {
        game.stats.mostPerfectsInRow = game.perfectCombos;
        saveGameStats();
        updateStatsDisplay();
    }
}

window.addEventListener('click', tryPlace);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); tryPlace(); }
});
