// 3D Island Renderer using WebGL
class Island3DRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to 2D');
            return null;
        }
        
        this.camera = {
            x: 0, y: 5, z: 10,
            rotX: -0.3, rotY: 0,
            fov: 45
        };
        
        this.mouse = { x: 0, y: 0, down: false };
        this.init();
    }
    
    init() {
        const gl = this.gl;
        
        // Vertex shader
        const vertexShaderSource = `
            attribute vec3 position;
            attribute vec3 normal;
            attribute vec2 texCoord;
            
            uniform mat4 modelMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 projectionMatrix;
            uniform vec3 lightDirection;
            
            varying vec3 vNormal;
            varying vec2 vTexCoord;
            varying float vLighting;
            
            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                vNormal = normal;
                vTexCoord = texCoord;
                vLighting = max(dot(normal, normalize(lightDirection)), 0.3);
            }
        `;
        
        // Fragment shader
        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec3 vNormal;
            varying vec2 vTexCoord;
            varying float vLighting;
            
            uniform vec3 color;
            uniform float time;
            
            void main() {
                vec3 finalColor = color * vLighting;
                
                // Add some wave effect for water
                if (color.b > 0.6) {
                    float wave = sin(vTexCoord.x * 10.0 + time) * 0.1 + 0.9;
                    finalColor *= wave;
                }
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        
        this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
        this.setupBuffers();
        this.setupUniforms();
        this.setupControls();
        
        // Start render loop
        this.render();
    }
    
    createShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexSource, fragmentSource) {
        const gl = this.gl;
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    setupBuffers() {
        // Create island geometry
        this.islandGeometry = this.createIslandGeometry();
        this.waterGeometry = this.createWaterGeometry();
        this.palmTreeGeometry = this.createPalmTreeGeometry();
        this.treasureGeometry = this.createTreasureGeometry();
        this.pirateGeometry = this.createPirateGeometry();
    }
    
    createIslandGeometry() {
        const vertices = [];
        const normals = [];
        const texCoords = [];
        const indices = [];
        
        // Generate island terrain using noise
        const size = 20;
        const resolution = 50;
        
        for (let i = 0; i <= resolution; i++) {
            for (let j = 0; j <= resolution; j++) {
                const x = (i / resolution - 0.5) * size;
                const z = (j / resolution - 0.5) * size;
                
                // Create island shape with noise
                const distance = Math.sqrt(x * x + z * z);
                const islandRadius = 8;
                let height = 0;
                
                if (distance < islandRadius) {
                    height = Math.cos(distance / islandRadius * Math.PI * 0.5) * 2;
                    height += this.noise(x * 0.1, z * 0.1) * 0.5;
                    height = Math.max(0, height);
                }
                
                vertices.push(x, height, z);
                normals.push(0, 1, 0); // Simplified normals
                texCoords.push(i / resolution, j / resolution);
                
                // Create triangles
                if (i < resolution && j < resolution) {
                    const a = i * (resolution + 1) + j;
                    const b = a + 1;
                    const c = a + (resolution + 1);
                    const d = c + 1;
                    
                    indices.push(a, b, c, b, d, c);
                }
            }
        }
        
        return this.createBufferGeometry(vertices, normals, texCoords, indices);
    }
    
    createWaterGeometry() {
        const size = 50;
        const vertices = [
            -size, -0.5, -size,
            size, -0.5, -size,
            size, -0.5, size,
            -size, -0.5, size
        ];
        
        const normals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        const texCoords = [0, 0, 1, 0, 1, 1, 0, 1];
        const indices = [0, 1, 2, 0, 2, 3];
        
        return this.createBufferGeometry(vertices, normals, texCoords, indices);
    }
    
    createPalmTreeGeometry() {
        const vertices = [];
        const normals = [];
        const texCoords = [];
        const indices = [];
        
        // Simple palm tree - trunk and leaves
        // Trunk
        const trunkHeight = 3;
        const trunkRadius = 0.2;
        const segments = 8;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * trunkRadius;
            const z = Math.sin(angle) * trunkRadius;
            
            vertices.push(x, 0, z);
            vertices.push(x, trunkHeight, z);
            normals.push(x, 0, z, x, 0, z);
            texCoords.push(i / segments, 0, i / segments, 1);
        }
        
        // Create trunk indices
        for (let i = 0; i < segments; i++) {
            const a = i * 2;
            const b = a + 1;
            const c = ((i + 1) % segments) * 2;
            const d = c + 1;
            
            indices.push(a, c, b, b, c, d);
        }
        
        // Add leaves at top (simplified)
        const leafCount = 6;
        const leafLength = 2;
        
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2;
            const x = Math.cos(angle) * leafLength;
            const z = Math.sin(angle) * leafLength;
            
            const baseIndex = vertices.length / 3;
            vertices.push(0, trunkHeight, 0);
            vertices.push(x, trunkHeight + 0.5, z);
            normals.push(0, 1, 0, 0, 1, 0);
            texCoords.push(0.5, 0.5, 1, 1);
        }
        
        return this.createBufferGeometry(vertices, normals, texCoords, indices);
    }
    
    createTreasureGeometry() {
        // Simple treasure chest
        const size = 0.3;
        const vertices = [
            -size, 0, -size, size, 0, -size, size, size, -size, -size, size, -size, // Front
            -size, 0, size, size, 0, size, size, size, size, -size, size, size,       // Back
        ];
        
        const normals = [];
        const texCoords = [];
        const indices = [
            0, 1, 2, 0, 2, 3, // Front
            4, 6, 5, 4, 7, 6, // Back
            0, 4, 7, 0, 7, 3, // Left
            1, 5, 6, 1, 6, 2, // Right
            3, 7, 6, 3, 6, 2, // Top
            0, 1, 5, 0, 5, 4  // Bottom
        ];
        
        // Generate normals and texCoords
        for (let i = 0; i < vertices.length; i += 3) {
            normals.push(0, 1, 0);
            texCoords.push((i / 3) % 2, Math.floor((i / 3) / 2) % 2);
        }
        
        return this.createBufferGeometry(vertices, normals, texCoords, indices);
    }
    
    createPirateGeometry() {
        // Simple pirate representation
        const vertices = [
            0, 0, 0,    // Bottom
            0, 1, 0,    // Top
            -0.3, 0.5, 0, 0.3, 0.5, 0  // Arms
        ];
        
        const normals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        const texCoords = [0, 0, 0, 1, 0, 0.5, 1, 0.5];
        const indices = [0, 1, 2, 0, 1, 3];
        
        return this.createBufferGeometry(vertices, normals, texCoords, indices);
    }
    
    createBufferGeometry(vertices, normals, texCoords, indices) {
        const gl = this.gl;
        
        const geometry = {
            vertexBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer(),
            texCoordBuffer: gl.createBuffer(),
            indexBuffer: gl.createBuffer(),
            indexCount: indices.length
        };
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        return geometry;
    }
    
    setupUniforms() {
        const gl = this.gl;
        gl.useProgram(this.program);
        
        this.uniforms = {
            modelMatrix: gl.getUniformLocation(this.program, 'modelMatrix'),
            viewMatrix: gl.getUniformLocation(this.program, 'viewMatrix'),
            projectionMatrix: gl.getUniformLocation(this.program, 'projectionMatrix'),
            lightDirection: gl.getUniformLocation(this.program, 'lightDirection'),
            color: gl.getUniformLocation(this.program, 'color'),
            time: gl.getUniformLocation(this.program, 'time')
        };
        
        this.attributes = {
            position: gl.getAttribLocation(this.program, 'position'),
            normal: gl.getAttribLocation(this.program, 'normal'),
            texCoord: gl.getAttribLocation(this.program, 'texCoord')
        };
    }
    
    setupControls() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouse.down) {
                const deltaX = e.clientX - this.mouse.x;
                const deltaY = e.clientY - this.mouse.y;
                
                this.camera.rotY += deltaX * 0.01;
                this.camera.rotX += deltaY * 0.01;
                this.camera.rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotX));
                
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            this.camera.z += e.deltaY * 0.01;
            this.camera.z = Math.max(5, Math.min(20, this.camera.z));
            e.preventDefault();
        });
    }
    
    render() {
        const gl = this.gl;
        const time = Date.now() * 0.001;
        
        // Clear
        gl.clearColor(0.5, 0.8, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        
        // Set up matrices
        const projectionMatrix = this.createPerspectiveMatrix();
        const viewMatrix = this.createViewMatrix();
        const modelMatrix = this.createIdentityMatrix();
        
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.uniforms.viewMatrix, false, viewMatrix);
        gl.uniform3f(this.uniforms.lightDirection, 0.5, 1.0, 0.5);
        gl.uniform1f(this.uniforms.time, time);
        
        // Render water
        this.renderGeometry(this.waterGeometry, modelMatrix, [0.2, 0.6, 1.0]);
        
        // Render island
        this.renderGeometry(this.islandGeometry, modelMatrix, [0.8, 0.7, 0.4]);
        
        // Render palm trees at specific positions
        const palmPositions = [
            [-3, 0, -2], [4, 0, -1], [-2, 0, 3], [3, 0, 2]
        ];
        
        palmPositions.forEach(pos => {
            const treeMatrix = this.createTranslationMatrix(pos[0], pos[1], pos[2]);
            this.renderGeometry(this.palmTreeGeometry, treeMatrix, [0.4, 0.2, 0.1]);
        });
        
        requestAnimationFrame(() => this.render());
    }
    
    renderGeometry(geometry, modelMatrix, color) {
        const gl = this.gl;
        
        gl.uniformMatrix4fv(this.uniforms.modelMatrix, false, modelMatrix);
        gl.uniform3f(this.uniforms.color, color[0], color[1], color[2]);
        
        // Bind attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
        gl.enableVertexAttribArray(this.attributes.position);
        gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.normalBuffer);
        gl.enableVertexAttribArray(this.attributes.normal);
        gl.vertexAttribPointer(this.attributes.normal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, geometry.texCoordBuffer);
        gl.enableVertexAttribArray(this.attributes.texCoord);
        gl.vertexAttribPointer(this.attributes.texCoord, 2, gl.FLOAT, false, 0, 0);
        
        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
        gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);
    }
    
    // Matrix helper functions
    createIdentityMatrix() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    
    createTranslationMatrix(x, y, z) {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }
    
    createPerspectiveMatrix() {
        const aspect = this.canvas.width / this.canvas.height;
        const fov = this.camera.fov * Math.PI / 180;
        const near = 0.1;
        const far = 100;
        
        const f = 1 / Math.tan(fov / 2);
        const rangeInv = 1 / (near - far);
        
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }
    
    createViewMatrix() {
        const cam = this.camera;
        
        // Simple view matrix calculation
        const cosX = Math.cos(cam.rotX);
        const sinX = Math.sin(cam.rotX);
        const cosY = Math.cos(cam.rotY);
        const sinY = Math.sin(cam.rotY);
        
        return new Float32Array([
            cosY, 0, sinY, 0,
            sinX * sinY, cosX, -sinX * cosY, 0,
            -cosX * sinY, sinX, cosX * cosY, 0,
            0, 0, -cam.z, 1
        ]);
    }
    
    // Simple noise function
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }
    
    // Public methods for game integration
    updatePlayerPosition(x, z) {
        this.playerPosition = { x, z };
    }
    
    updateTreasures(treasures) {
        this.treasures = treasures;
    }
    
    setViewMode(mode) {
        if (mode === 'overview') {
            this.camera.rotX = -0.8;
            this.camera.z = 15;
        } else if (mode === 'close') {
            this.camera.rotX = -0.3;
            this.camera.z = 8;
        }
    }
}