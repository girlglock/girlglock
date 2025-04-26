let scene, camera, renderer, composer, renderPass;

let game = {
    isMobile: false,
    render: {
        lastFrameTime: 0,
        frameInterval: 1000 / 60
    },
    visuals: {
        colors: [0xf6abb6, 0xdcd6f7, 0xa7c7e7],
        boxHeight: 1,
        initialCameraPosition: { x: 15, y: 13, z: 15 },
        baseDimensions: { width: 5, depth: 5 },
        outlineShader: {
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                outlineColor: { value: new THREE.Vector3(0, 0, 0) },
                threshold: { value: 0.1 },
                outlineSize: { value: 2 }
            },
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D tDiffuse;
              uniform vec2 resolution;
              uniform vec3 outlineColor;
              uniform float threshold;
              uniform float outlineSize;
              varying vec2 vUv;
          
              void main() {
                vec4 texel = texture2D(tDiffuse, vUv);
                vec2 pixelSize = vec2(1.0) / resolution;
                
                float alpha = 0.0;
                
                for(float x = -outlineSize; x <= outlineSize; x++) {
                  for(float y = -outlineSize; y <= outlineSize; y++) {
                    if(x != 0.0 || y != 0.0) {
                      vec4 neighbor = texture2D(tDiffuse, vUv + vec2(x, y) * pixelSize);
                      if(abs(texel.a - neighbor.a) > threshold) {
                        alpha = 0.50;
                      }
                    }
                  }
                }
                
                gl_FragColor = mix(texel, vec4(outlineColor, 1.0), alpha);
              }
            `
        }
    },
    state: {
        stack: [],
        currentLayer: null,
        direction: new THREE.Vector3(1, 0, 0),
        speed: 0.15,
        gameEnded: false,
        axisToggle: true
    },
    camera: {
        targetY: 15,
        transitionDuration: 0.25,
        transitionStartTime: null
    },
    score: {
        current: 0,
        multiplier: 1,
        perfectCombos: 0
    },
    config: {
        boardBounds: 10,
        perfectVolumeThreshold: 0.25,
        slabFallDistance: 10,
        slabFallDuration: 1000,
        perfectScoreMultiplier: 2,
    },
    ui: {
        scoreHint: document.getElementById("scoreHint"),
        startHint: document.getElementById("startHint"),
        gameOverHint: document.getElementById("gameOverHint")
    },
    stats: {
        bestScore: 0,
        timesPlayed: 0,
        mostPerfectsInRow: 0
    },
    controls: {
        inputLocked: false
    }
};

const sounds = {
    place: new Audio('sounds/place.mp3'),
    gameover: new Audio('sounds/gameover.mp3'),
    perfect: new Audio('sounds/perfect.mp3'),
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

    game.isMobile = new MobileDetect(window.navigator.userAgent).mobile();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(
        game.visuals.initialCameraPosition.x,
        game.visuals.initialCameraPosition.y,
        game.visuals.initialCameraPosition.z
    );
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        antialias: !game.isMobile,
        alpha: true,
        powerPreference: 'low-power',
        precision: game.isMobile ? 'lowp' : 'highp',
        depthWrite: !game.isMobile
    });

    renderer.localClippingEnabled = true;

    if (game.isMobile) {
        renderer.setPixelRatio(Math.min(0.5, window.devicePixelRatio));
        game.camera.transitionDuration = 0.15;
    } else {
        renderer.setPixelRatio(window.devicePixelRatio);
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    composer = new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outlinePass = new THREE.ShaderPass(game.visuals.outlineShader);
    outlinePass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    composer.addPass(outlinePass);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const base = createSlab(0, 0, game.visuals.baseDimensions.width, game.visuals.baseDimensions.depth);
    scene.add(base);
    game.state.stack.push(base);

    game.ui.scoreHint.style.display = 'block';
    game.ui.startHint.style.display = 'block';
    game.ui.gameOverHint.style.display = 'none';

    addSlab();

    initInputHandlers();

    window.addEventListener('resize', onWindowResize);
}

function initInputHandlers() {
    window.removeEventListener('click', tryPlace);
    window.removeEventListener('touchstart', handleTouch);
    window.removeEventListener('keydown', handleKeydown);

    if ('ontouchstart' in window) {
        window.addEventListener('touchstart', handleTouch, { passive: false });
    } else {
        window.addEventListener('click', tryPlace);
    }

    window.addEventListener('keydown', handleKeydown);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSlab(x, y, width, depth) {
    const geometry = new THREE.BoxGeometry(width, game.visuals.boxHeight, depth);
    const material = new THREE.MeshLambertMaterial({
        color: game.visuals.colors[game.state.stack.length % game.visuals.colors.length]
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, 0);
    return box;
}

function addSlab() {
    const lastLayer = game.state.stack[game.state.stack.length - 1];
    const width = lastLayer.scale.x * lastLayer.geometry.parameters.width;
    const depth = lastLayer.scale.z * lastLayer.geometry.parameters.depth;
    const y = game.visuals.boxHeight * game.state.stack.length;
    let x = lastLayer.position.x;
    let z = lastLayer.position.z;
    if (game.state.axisToggle) {
        z = -game.config.boardBounds;
    } else {
        x = -game.config.boardBounds;
    }

    const box = createSlab(x, y, width, depth);
    box.position.z = game.state.axisToggle ? -game.config.boardBounds : lastLayer.position.z;
    box.position.x = game.state.axisToggle ? lastLayer.position.x : -game.config.boardBounds;
    box.moving = true;

    scene.add(box);
    game.state.currentLayer = box;

    game.state.direction = game.state.axisToggle
        ? new THREE.Vector3(0, 0, 1)
        : new THREE.Vector3(1, 0, 0);

    game.state.axisToggle = !game.state.axisToggle;
    game.state.speed += 0.005;

    if (game.state.stack.length > 1) game.ui.startHint.style.display = "none";
}

function placeSlab() {
    const last = game.state.stack[game.state.stack.length - 1];
    const current = game.state.currentLayer;
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
    const overhangVolume = (incomingArea - overlapArea) * game.visuals.boxHeight;
    let wasPerfect = false;

    if (overhangVolume <= game.config.perfectVolumeThreshold) {
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
                ? new THREE.BoxGeometry(overhangLen, game.visuals.boxHeight, overlapZ)
                : new THREE.BoxGeometry(overlapX, game.visuals.boxHeight, overhangLen);
            const mat = current.material.clone();
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(current.position.x, current.position.y, current.position.z);
            mesh.position[axis] += dir * (overlapLen / 2 + overhangLen / 2);
            scene.add(mesh);
            new TWEEN.Tween(mesh.position)
                .to({ y: mesh.position.y - game.config.slabFallDistance }, game.config.slabFallDuration)
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
    game.state.stack.push(current);
    game.state.currentLayer = null;

    if (wasPerfect) {
        playSound('perfect');
        game.score.perfectCombos++;
        game.score.multiplier++;
        game.score.current += game.config.perfectScoreMultiplier * game.score.multiplier;
    } else {
        game.score.perfectCombos = 0;
        game.score.multiplier = 1;
        game.score.current += game.score.multiplier;
        playSound('place');
    }

    game.ui.scoreHint.textContent = `Score: ${game.score.current} (x${game.score.multiplier})`;
    game.camera.targetY = camera.position.y + game.visuals.boxHeight;
    game.camera.transitionStartTime = Date.now();

    composer.render();

    addSlab();
}

function animate(currentTime) {
    requestAnimationFrame(animate);

    if (currentTime - game.render.lastFrameTime < game.render.frameInterval) return;

    game.render.lastFrameTime = currentTime;

    if (game.state.currentLayer && game.state.currentLayer.moving && !game.state.gameEnded) {
        game.state.currentLayer.position.add(game.state.direction.clone().multiplyScalar(game.state.speed));
        const axisPos = game.state.direction.x !== 0 ? game.state.currentLayer.position.x : game.state.currentLayer.position.z;
        if (Math.abs(axisPos) > game.config.boardBounds) game.state.direction.negate();
    }

    if (game.camera.transitionStartTime !== null) {
        const elapsedTime = (Date.now() - game.camera.transitionStartTime) / 1000;
        if (elapsedTime < game.camera.transitionDuration) {
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, game.camera.targetY, elapsedTime / game.camera.transitionDuration);
        } else {
            camera.position.y = game.camera.targetY;
            game.camera.transitionStartTime = null;
        }
    }

    composer.render();
    TWEEN.update();
}

function gameOver() {
    game.state.gameEnded = true;
    game.ui.gameOverHint.style.display = 'block';
    playSound('gameover');
    updatePB();
    addMostPerfs();

    renderer.render(scene, camera);
    console.log('game over');
}

function tryPlace() {
    if (!game.state.currentLayer) return;
    if (game.state.gameEnded) {
        setTimeout(() => {
            if(!game.isMobile) {
                console.log('PC');
                restartGame();
                setTimeout(() => { game.controls.inputLocked = false; }, 300);
                return;
            } else {
                console.log('mobile');
                restartGame();
                setTimeout(() => { game.controls.inputLocked = false; }, 300);
                /* addTimesPlayed();
                updatePB();
                window.location.reload(); //im too lazy to fix this heeeeeeeelp */
                return;
            }
        }, 500);
    }
    else
        placeSlab();
}

function restartGame() {
    if (game.state.currentLayer) scene.remove(game.state.currentLayer);

    while (game.state.stack.length) scene.remove(game.state.stack.pop());

    game.state.currentLayer = null;
    game.state.speed = 0.15;
    game.state.gameEnded = false;
    game.score.current = 0;
    game.score.perfectCombos = 0;
    game.score.multiplier = 1;
    game.state.axisToggle = false;
    game.ui.scoreHint.textContent = "Score: 0";
    game.ui.scoreHint.style.display = 'block';
    game.ui.startHint.style.display = 'block';
    game.ui.gameOverHint.style.display = 'none';

    const base = createSlab(0, 0, game.visuals.baseDimensions.width, game.visuals.baseDimensions.depth);
    scene.add(base);
    game.state.stack.push(base);

    camera.position.set(
        game.visuals.initialCameraPosition.x,
        game.visuals.initialCameraPosition.y,
        game.visuals.initialCameraPosition.z
    );
    camera.lookAt(0, 0, 0);

    addSlab();
    addTimesPlayed();

    initInputHandlers();

    renderer.render(scene, camera);
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
    if (game.score.current > game.stats.bestScore) {
        game.stats.bestScore = game.score.current;
        saveGameStats();
    }
}

function addTimesPlayed() {
    game.stats.timesPlayed += 1;
    saveGameStats();
    updateStatsDisplay();
}

function addMostPerfs() {
    if (game.score.perfectCombos > game.stats.mostPerfectsInRow) {
        game.stats.mostPerfectsInRow = game.score.perfectCombos;
        saveGameStats();
        updateStatsDisplay();
    }
}

function handleTouch(e) {
    e.preventDefault();
    tryPlace();
}

function handleKeydown(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        tryPlace();
    }
}