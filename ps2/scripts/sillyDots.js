class SillyDots {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;
        this.dots = [];
        this.trails = [];
        this.dotPositions = Array(7).fill().map(() => []);
        this.mousePositions = [];
        this.isAnimating = true;
        this.time = 0;
        this.speed = 5;
        this.dotRadius = this.screenHeight / 55;
        this.radius = this.screenHeight / 5;
        this.centerX = this.screenWidth / 2 - this.screenHeight / 7;
        this.centerY = this.screenHeight / 2;
        this.angleFreq = 0.008;
        this.syncCycleDuration = 120 * 120;
        this.dotAngleOffsets = Array(7).fill().map((_, i) => i * 0.75);
        this.trailLength = this.screenHeight / 48;
        this.trailThickness = this.screenHeight / 200;
        this.globeRotationSpeed = 0.003;
        this.targetFps = 60;
        this.frameDelay = 1000 / this.targetFps;
        this.createDots();
        this.animate();
        window.addEventListener('resize', () => {
            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;
            this.canvas.width = this.screenWidth;
            this.canvas.height = this.screenHeight;
            this.centerX = this.screenWidth / 2 - this.screenHeight / 7;
            this.centerY = this.screenHeight / 2;
        });

        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const last = this.mousePositions[0];
            if (!last || last.x !== x || last.y !== y) 
                this.mousePositions.unshift({ x, y });
        });
    }

    createDots() {
        for (let i = 0; i < 7; i++) {
            this.dots.push({ x: 0, y: 0, scale: 1, perspectiveFactor: 1 });
            this.trails.push([]);
        }
    }

    project3dTo2d(x, y, z) {
        const perspectiveFactor = 1 / (1 + z * 0.001);
        const screenX = x * perspectiveFactor;
        const screenY = y * perspectiveFactor;
        return { screenX, screenY, perspectiveFactor };
    }

    drawGlowBall(x, y, scale) {
        const size = 96 * scale;
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        gradient.addColorStop(0, 'rgba(44, 118, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(44, 118, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(44, 118, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateTrails() {
        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            const x = dot.x;
            const y = dot.y;
            this.dotPositions[i].unshift({ x, y });
            if (this.dotPositions[i].length > this.trailLength) {
                this.dotPositions[i].pop();
            }
            const positions = this.dotPositions[i];
            for (let j = 0; j < positions.length - 1; j++) {
                const pos1 = positions[j];
                const pos2 = positions[j + 1];
                const fadeProgress = Math.pow(j / this.trailLength, 0.3);
                const width = Math.max(1, (1 - fadeProgress) * this.trailThickness);
                const redVal = Math.floor(107 * (1 - fadeProgress));
                const greenVal = Math.floor(245 * (1 - fadeProgress));
                const blueVal = Math.floor(255 * (1 - 0.4 * fadeProgress));
                this.ctx.strokeStyle = `rgb(${redVal}, ${greenVal}, ${blueVal})`;
                this.ctx.lineWidth = width;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(pos1.x, pos1.y);
                this.ctx.lineTo(pos2.x, pos2.y);
                this.ctx.stroke();
            }
        }
    }

    updateMouseTrail() {
        const positions = this.mousePositions;
        const maxLength = Math.max(1, (this.trailLength * 3) || 10);

        if (positions.length > maxLength)
            positions.splice(maxLength);
        else if (positions.length > 3)
            positions.splice(-3);

        for (let j = 0; j < positions.length - 1; j++) {
            const pos1 = positions[j];
            const pos2 = positions[j + 1];
            const fadeProgress = Math.pow(j / maxLength, 0.2);
            const width = Math.max(1, (1 - fadeProgress) * (this.trailThickness * 0.1));
            const redVal = Math.floor(107 * (1 - fadeProgress));
            const greenVal = Math.floor(245 * (1 - fadeProgress));
            const blueVal = Math.floor(255 * (1 - 0.4 * fadeProgress));
            this.ctx.strokeStyle = `rgb(${redVal}, ${greenVal}, ${blueVal})`;
            this.ctx.lineWidth = width;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(pos1.x, pos1.y);
            this.ctx.lineTo(pos2.x, pos2.y);
            this.ctx.stroke();
        }
    }

    animate() {
        if (!this.isAnimating) return;
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
        this.time += this.speed;
        const globeAngle = this.time * this.globeRotationSpeed;
        const currentRadius = this.radius;
        const baseAngle = this.time * this.angleFreq;

        for (let i = 0; i < this.dots.length; i++) {
            const dotAngle = (i * 2 * Math.PI) / 7;
            const cycleProgress = (this.time % this.syncCycleDuration) / this.syncCycleDuration;
            const desyncMultiplier = Math.sin(cycleProgress * Math.PI);
            const desyncOffset = this.dotAngleOffsets[i] * desyncMultiplier;
            const circleX = Math.cos(baseAngle + dotAngle + desyncOffset) * currentRadius;
            const circleY = Math.sin(baseAngle + dotAngle + desyncOffset * 1.1) * currentRadius;
            const globeRadius = circleX;
            const height = circleY;
            const x3d = globeRadius * Math.cos(globeAngle);
            const y3d = height;
            const z3d = globeRadius * Math.sin(globeAngle);
            const { screenX, screenY, perspectiveFactor } = this.project3dTo2d(x3d, y3d, z3d);
            const x = this.centerX + screenX;
            const y = this.centerY + screenY;
            const distance = Math.sqrt(screenX * screenX + screenY * screenY);
            let scale = (0.8 + (distance / this.radius) * 0.4) * perspectiveFactor;
            scale = Math.max(scale, 0.3);
            this.dots[i].x = x;
            this.dots[i].y = y;
            this.dots[i].scale = scale;
            this.dots[i].perspectiveFactor = perspectiveFactor;
        }

        this.updateTrails();

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            this.drawGlowBall(dot.x, dot.y, dot.scale);
            const dotSize = this.dotRadius * dot.scale;
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.updateMouseTrail();

        setTimeout(() => this.animate(), this.frameDelay);
    }
}