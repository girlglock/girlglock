class PS2Background {
    constructor() {
        this.container = document.createElement("div");
        this.container.className = "ps2-screen";
        document.body.insertBefore(this.container, document.body.firstChild);
        
        this.inner = document.createElement("div");
        this.inner.className = "ps2-inner";
        
        const innerBg = document.createElement("div");
        innerBg.className = "ps2-inner-bg";
        this.inner.appendChild(innerBg);
        
        for (let i = 0; i < 112; i++) {
            const boxContainer = document.createElement("div");
            boxContainer.className = "ps2-box-container";
            
            const box = document.createElement("div");
            box.className = "ps2-box";
            
            const top = document.createElement("div");
            top.className = "ps2-top";
            const bottom = document.createElement("div");
            bottom.className = "ps2-bottom";
            const left = document.createElement("div");
            left.className = "ps2-left";
            const right = document.createElement("div");
            right.className = "ps2-right";
            
            box.appendChild(top);
            box.appendChild(bottom);
            box.appendChild(left);
            box.appendChild(right);
            boxContainer.appendChild(box);
            this.inner.appendChild(boxContainer);
        }
        
        this.container.appendChild(this.inner);
        
        this.mouseActive = false;
        this.lastMouseMove = Date.now();
        this.idleTime = 0;
        
        this.setupMouseParallax();
        this.applyRandomDepths();
        this.scaleGrid();
        this.startIdleAnimation();
        
        window.addEventListener("resize", () => {
            this.scaleGrid();
        });
    }
    
    scaleGrid() {
        const gridWidth = 14;
        const gridHeight = 8;
        const aspectRatio = gridWidth / gridHeight;
        const windowAspect = window.innerWidth / window.innerHeight;
        
        let scale = 1;
        if (windowAspect > aspectRatio) {
            scale = window.innerHeight / 800;
        } else {
            scale = window.innerWidth / 1400;
        }
        
        this.inner.style.fontSize = `${scale * 100}%`;
    }
    
    applyRandomDepths() {
        const boxes = this.container.querySelectorAll(".ps2-box");
        boxes.forEach(box => {
            const depth = (Math.random() * 20 - 20);
            const brightness = Math.random() * 55;
            box.style.transform = `translateZ(${depth}vw)`;
            box.style.backgroundColor = `rgba(${Math.floor(97 - brightness)}, ${Math.floor(106 - brightness)}, ${Math.floor(146 - brightness)}, 0.95)`;
        });
    }
    
    setupMouseParallax() {
        document.addEventListener("mousemove", (e) => {
            this.mouseActive = true;
            this.lastMouseMove = Date.now();
            
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            const rotateY = mouseX * 20;
            const rotateX = -mouseY * 20;
            const rotateZ = mouseX * 2;
            const translateZ = (Math.abs(mouseX) + Math.abs(mouseY)) * 10;
            
            this.inner.style.transform = `
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                rotateZ(${rotateZ}deg) 
                translateZ(${translateZ}px)
            `;
        });
    }
    
    startIdleAnimation() {
        const animate = () => {
            const now = Date.now();
            const timeSinceMouseMove = now - this.lastMouseMove;
            
            if (timeSinceMouseMove > 1000) {
                this.mouseActive = false;
                this.idleTime += 0.016;
                
                const rotateX = Math.sin(this.idleTime * 0.3) * 5;
                const rotateY = Math.cos(this.idleTime * 0.2) * 8;
                const rotateZ = Math.sin(this.idleTime * 0.15) * 1.5;
                const translateZ = Math.abs(Math.sin(this.idleTime * 0.25)) * 5;
                
                this.inner.style.transform = `
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    rotateZ(${rotateZ}deg) 
                    translateZ(${translateZ}px)
                `;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}