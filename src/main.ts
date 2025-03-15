import * as THREE from 'three';
import { Plane } from './components/Plane';
import { Terrain } from './components/Terrain';
import { RingManager } from './components/RingManager';

class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private plane: Plane;
    private terrain: Terrain;
    private ringManager: RingManager;
    private score: number = 0;
    private keysPressed: Set<string> = new Set();
    private touchControls: { [key: string]: boolean } = {
        up: false,
        down: false,
        left: false,
        right: false,
        speedUp: false,
        speedDown: false
    };

    constructor() {
        // Initialize scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue

        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.camera.position.set(0, 100, -200);

        // Initialize renderer
        const canvas = document.getElementById('game-container') as HTMLCanvasElement;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 100, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.scene.add(directionalLight);

        // Initialize game components
        this.plane = new Plane(this.scene);
        this.terrain = new Terrain(this.scene);
        this.ringManager = new RingManager(this.scene);

        // Event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));

        // Touch controls
        this.setupTouchControls();

        // Add instructions to HUD
        const instructions = document.createElement('div');
        instructions.innerHTML = `
            Controls:<br>
            W/↑ : Pitch Up<br>
            S/↓ : Pitch Down<br>
            A/← : Turn Left<br>
            D/→ : Turn Right<br>
            Shift : Speed Up<br>
            Control : Slow Down
        `;
        instructions.style.position = 'fixed';
        instructions.style.top = '20px';
        instructions.style.right = '20px';
        instructions.style.color = 'white';
        instructions.style.fontFamily = 'Arial, sans-serif';
        instructions.style.fontSize = '16px';
        instructions.style.textShadow = '2px 2px 2px rgba(0,0,0,0.5)';
        instructions.style.textAlign = 'right';
        instructions.style.pointerEvents = 'none';
        document.body.appendChild(instructions);

        // Start game loop
        this.animate();
    }

    private setupTouchControls(): void {
        const controls = ['up', 'down', 'left', 'right'];
        controls.forEach(control => {
            const button = document.getElementById(control);
            if (button) {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.touchControls[control] = true;
                });
                button.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.touchControls[control] = false;
                });
            }
        });

        // Speed controls
        const speedUp = document.getElementById('speed-up');
        const speedDown = document.getElementById('speed-down');
        
        if (speedUp) {
            speedUp.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls.speedUp = true;
            });
            speedUp.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchControls.speedUp = false;
            });
        }

        if (speedDown) {
            speedDown.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls.speedDown = true;
            });
            speedDown.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchControls.speedDown = false;
            });
        }

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent): void {
        this.keysPressed.add(event.key);
    }

    private onKeyUp(event: KeyboardEvent): void {
        this.keysPressed.delete(event.key);
    }

    private handleInput(): void {
        // Handle keyboard input
        this.keysPressed.forEach(key => {
            this.plane.handleInput(key);
        });

        // Handle touch input
        if (this.touchControls.up) this.plane.handleInput('ArrowUp');
        if (this.touchControls.down) this.plane.handleInput('ArrowDown');
        if (this.touchControls.left) this.plane.handleInput('ArrowLeft');
        if (this.touchControls.right) this.plane.handleInput('ArrowRight');
        if (this.touchControls.speedUp) this.plane.handleInput('Shift');
        if (this.touchControls.speedDown) this.plane.handleInput('Control');
    }

    private updateHUD(): void {
        const scoreElement = document.getElementById('score');
        const speedElement = document.getElementById('speed');
        if (scoreElement) scoreElement.textContent = `Score: ${this.score}`;
        if (speedElement) speedElement.textContent = `Speed: ${Math.round(this.plane.getSpeed())} km/h`;
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        // Handle continuous input
        this.handleInput();

        // Update game components
        this.plane.update();
        this.terrain.update(this.plane.getPosition());
        this.ringManager.update(this.plane.getPosition());

        // Update camera position to follow plane
        const planePos = this.plane.getPosition();
        this.camera.position.set(
            planePos.x - 200 * Math.sin(this.plane.getRotation().y),
            planePos.y + 100,
            planePos.z - 200 * Math.cos(this.plane.getRotation().y)
        );
        this.camera.lookAt(planePos);

        // Check collisions with rings
        if (this.ringManager.checkCollisions(this.plane.getPosition())) {
            this.score += 10;
        }

        this.updateHUD();
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 