// CSS 3D Island Renderer (WebGL fallback)
class CSS3DRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.container = canvas.parentElement;
        this.is3D = false;
        this.rotationX = -20;
        this.rotationY = 0;
        this.zoom = 1;
        this.init();
    }
    
    init() {
        this.create3DContainer();
        this.setupControls();
    }
    
    create3DContainer() {
        // Create 3D scene container
        this.scene3D = document.createElement('div');
        this.scene3D.id = 'scene-3d';
        this.scene3D.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            perspective: 1000px;
            perspective-origin: center center;
            display: none;
            overflow: hidden;
            background: linear-gradient(to bottom, #87CEEB 0%, #4682B4 70%, #2F4F4F 100%);
        `;
        
        // Create island container
        this.island3D = document.createElement('div');
        this.island3D.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 600px;
            height: 400px;
            transform-origin: center center;
            transform-style: preserve-3d;
            transform: translate(-50%, -50%) rotateX(-20deg) rotateY(0deg);
            transition: transform 0.3s ease;
        `;
        
        this.createIslandElements();
        this.scene3D.appendChild(this.island3D);
        this.container.appendChild(this.scene3D);
    }
    
    createIslandElements() {
        // Create island base
        const islandBase = document.createElement('div');
        islandBase.style.cssText = `
            position: absolute;
            width: 500px;
            height: 350px;
            background: radial-gradient(ellipse at center, #F4A460 0%, #D2B48C 40%, #8B4513 70%, #4682B4 100%);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotateX(90deg);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        `;
        
        // Create island height layers
        for (let i = 0; i < 5; i++) {
            const layer = document.createElement('div');
            const size = 500 - (i * 60);
            const height = i * 8;
            layer.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * 0.7}px;
                background: ${i === 0 ? '#F4A460' : i < 3 ? '#D2B48C' : '#8B4513'};
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotateX(90deg) translateZ(${height}px);
                opacity: ${1 - (i * 0.1)};
            `;
            this.island3D.appendChild(layer);
        }
        
        // Add palm trees
        this.createPalmTree(-150, -100, 30);
        this.createPalmTree(120, -80, 25);
        this.createPalmTree(-80, 120, 35);
        this.createPalmTree(180, 100, 28);
        
        // Add treasure chests
        this.treasureElements = [];
        this.createTreasureChest(-50, -50);
        this.createTreasureChest(100, 80);
        this.createTreasureChest(-120, 60);
        
        // Add pirate character
        this.createPirate(0, 0);
        
        // Add water waves
        this.createWaterWaves();
        
        this.island3D.appendChild(islandBase);
    }
    
    createPalmTree(x, y, height) {
        const tree = document.createElement('div');
        tree.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translate(${x}px, ${y}px) translateZ(40px);
            transform-style: preserve-3d;
        `;
        
        // Trunk
        const trunk = document.createElement('div');
        trunk.style.cssText = `
            width: 8px;
            height: ${height}px;
            background: linear-gradient(to bottom, #8B4513, #A0522D);
            border-radius: 4px;
            position: relative;
            transform-origin: bottom center;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        `;
        
        // Leaves
        const leaves = document.createElement('div');
        leaves.style.cssText = `
            position: absolute;
            top: -15px;
            left: -20px;
            width: 48px;
            height: 30px;
            transform-style: preserve-3d;
        `;
        
        for (let i = 0; i < 6; i++) {
            const leaf = document.createElement('div');
            const angle = (i / 6) * 360;
            leaf.style.cssText = `
                position: absolute;
                width: 30px;
                height: 8px;
                background: linear-gradient(to right, #228B22, #32CD32);
                border-radius: 15px 4px;
                top: 50%;
                left: 50%;
                transform-origin: left center;
                transform: translate(-50%, -50%) rotateZ(${angle}deg) rotateY(${Math.sin(angle * Math.PI / 180) * 30}deg);
                animation: palmSway 3s ease-in-out infinite;
                animation-delay: ${i * 0.1}s;
            `;
            leaves.appendChild(leaf);
        }
        
        trunk.appendChild(leaves);
        tree.appendChild(trunk);
        this.island3D.appendChild(tree);
    }
    
    createTreasureChest(x, y) {
        const chest = document.createElement('div');
        chest.className = 'treasure-3d';
        chest.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 15px;
            transform: translate(-50%, -50%) translate(${x}px, ${y}px) translateZ(45px);
            transform-style: preserve-3d;
        `;
        
        // Chest base
        const base = document.createElement('div');
        base.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #8B4513, #A0522D);
            border: 1px solid #654321;
            border-radius: 2px;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        `;
        
        // Gold glow effect
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%);
            border-radius: 4px;
            animation: treasureGlow 2s ease-in-out infinite alternate;
        `;
        
        base.appendChild(glow);
        chest.appendChild(base);
        this.island3D.appendChild(chest);
        this.treasureElements.push(chest);
    }
    
    createPirate(x, y) {
        this.pirate3D = document.createElement('div');
        this.pirate3D.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            width: 16px;
            height: 20px;
            transform: translate(-50%, -50%) translate(${x}px, ${y}px) translateZ(50px);
            transform-style: preserve-3d;
        `;
        
        // Pirate body
        const body = document.createElement('div');
        body.style.cssText = `
            width: 12px;
            height: 16px;
            background: linear-gradient(to bottom, #8B0000, #A52A2A);
            border-radius: 6px;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.4);
        `;
        
        // Pirate hat
        const hat = document.createElement('div');
        hat.style.cssText = `
            position: absolute;
            top: -8px;
            left: -2px;
            width: 16px;
            height: 8px;
            background: #000;
            border-radius: 8px 8px 0 0;
            transform: rotateX(20deg);
        `;
        
        // Skull symbol
        const skull = document.createElement('div');
        skull.style.cssText = `
            position: absolute;
            top: 1px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 6px;
            line-height: 1;
        `;
        skull.textContent = '☠';
        
        hat.appendChild(skull);
        body.appendChild(hat);
        this.pirate3D.appendChild(body);
        this.island3D.appendChild(this.pirate3D);
    }
    
    createWaterWaves() {
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: absolute;
                width: 800px;
                height: 600px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotateX(90deg) translateZ(-20px);
                animation: waterWave 4s ease-in-out infinite;
                animation-delay: ${i * 1.3}s;
                pointer-events: none;
            `;
            this.island3D.appendChild(wave);
        }
    }
    
    setupControls() {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        
        this.scene3D.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            this.scene3D.style.cursor = 'grabbing';
        });
        
        this.scene3D.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            
            this.rotationY += deltaX * 0.5;
            this.rotationX -= deltaY * 0.5;
            this.rotationX = Math.max(-60, Math.min(10, this.rotationX));
            
            this.updateTransform();
            
            lastX = e.clientX;
            lastY = e.clientY;
        });
        
        this.scene3D.addEventListener('mouseup', () => {
            isDragging = false;
            this.scene3D.style.cursor = 'grab';
        });
        
        this.scene3D.addEventListener('wheel', (e) => {
            this.zoom += e.deltaY * -0.001;
            this.zoom = Math.max(0.5, Math.min(2, this.zoom));
            this.updateTransform();
            e.preventDefault();
        });
        
        this.scene3D.style.cursor = 'grab';
    }
    
    updateTransform() {
        this.island3D.style.transform = `
            translate(-50%, -50%) 
            rotateX(${this.rotationX}deg) 
            rotateY(${this.rotationY}deg) 
            scale(${this.zoom})
        `;
    }
    
    show() {
        this.scene3D.style.display = 'block';
        this.is3D = true;
        this.addAnimations();
    }
    
    hide() {
        this.scene3D.style.display = 'none';
        this.is3D = false;
    }
    
    addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes palmSway {
                0%, 100% { transform: translate(-50%, -50%) rotateZ(var(--angle)) rotateY(var(--y-rot)) rotateX(0deg); }
                50% { transform: translate(-50%, -50%) rotateZ(var(--angle)) rotateY(var(--y-rot)) rotateX(10deg); }
            }
            
            @keyframes treasureGlow {
                0% { opacity: 0.4; transform: scale(1); }
                100% { opacity: 0.8; transform: scale(1.1); }
            }
            
            @keyframes waterWave {
                0% { transform: translate(-50%, -50%) rotateX(90deg) translateZ(-20px) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) rotateX(90deg) translateZ(-20px) scale(1.2); opacity: 0.1; }
                100% { transform: translate(-50%, -50%) rotateX(90deg) translateZ(-20px) scale(1.4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    updatePlayerPosition(x, y) {
        if (this.pirate3D) {
            this.pirate3D.style.transform = `
                translate(-50%, -50%) 
                translate(${x * 2}px, ${y * 2}px) 
                translateZ(50px)
            `;
        }
    }
    
    updateTreasures(treasures) {
        this.treasureElements.forEach((element, index) => {
            if (treasures[index] && treasures[index].found) {
                element.style.display = 'none';
            } else {
                element.style.display = 'block';
            }
        });
    }
}