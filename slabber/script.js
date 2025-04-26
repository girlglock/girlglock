let scene, camera, renderer;
let game = {
    stack: [],
    currentLayer: null,
    direction: new THREE.Vector3(1, 0, 0),
    speed: 0.05,
    boxHeight: 1,
    gameEnded: false,
    score: 0,
    axisToggle: false,
    cameraTargetY: 15,
    transitionDuration: 0.25,
    transitionStartTime: null,
    colors: [0xf6abb6, 0xdcd6f7, 0xa7c7e7],
    scoreHint: document.getElementById("scoreHint"),
    startHint: document.getElementById("startHint"),
    gameOverHint: document.getElementById("gameOverHint")
};

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(15, 13, 15);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
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
    const material = new THREE.MeshPhongMaterial({ color: game.colors[game.stack.length % game.colors.length] });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, 0);
    return box;
}

function addSlab() {
    const lastLayer = game.stack[game.stack.length - 1];
    const width = lastLayer.scale.x * lastLayer.geometry.parameters.width;
    const depth = lastLayer.scale.z * lastLayer.geometry.parameters.depth;
    const y = game.boxHeight * game.stack.length;

    const box = createSlab(game.axisToggle ? 0 : -10, y, width, depth);
    box.position.z = game.axisToggle ? -10 : 0;
    box.moving = true;
    scene.add(box);
    game.currentLayer = box;

    game.direction = game.axisToggle ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
    game.axisToggle = !game.axisToggle;
    game.speed += 0.005;

    if (game.stack.length > 1) game.startHint.style.display = "none";
}

function placeSlab() {
    const lastLayer = game.stack[game.stack.length - 1];
    const delta = new THREE.Vector3().subVectors(game.currentLayer.position, lastLayer.position);
    const moveAxis = game.direction.x !== 0 ? "x" : "z";
    const size = moveAxis === "x"
        ? game.currentLayer.geometry.parameters.width
        : game.currentLayer.geometry.parameters.depth;
    const overlap = size - Math.abs(delta[moveAxis]);

    if (overlap <= 0) {
        gameOver();
        return;
    }

    const newSize = overlap;
    const newPos = lastLayer.position[moveAxis] + delta[moveAxis] / 2;

    game.currentLayer.scale[moveAxis] = newSize / size;
    game.currentLayer.position[moveAxis] = newPos;

    game.currentLayer.moving = false;
    game.stack.push(game.currentLayer);
    game.currentLayer = null;

    game.score++;
    game.scoreHint.textContent = `Score: ${game.score}`;

    game.cameraTargetY = camera.position.y + game.boxHeight;
    game.transitionStartTime = Date.now();

    addSlab();
}

function animate() {
    requestAnimationFrame(animate);

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
}

function gameOver() {
    game.gameEnded = true;
    game.gameOverHint.style.display = 'block';
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
    game.speed = 0.05;
    game.gameEnded = false;
    game.score = 0;
    game.axisToggle = false;
    game.scoreHint.textContent = "Score: 0";
    game.scoreHint.style.display = 'block';
    game.startHint.style.display = 'block';
    game.gameOverHint.style.display = 'none';

    const base = createSlab(0, 0, 5, 5);
    scene.add(base);
    game.stack.push(base);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    addSlab();
}

window.addEventListener('click', tryPlace);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); tryPlace(); }
});