import * as THREE from 'three';

export class Plane {
    private mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private rotation: THREE.Euler;
    private speed: number;
    private maxSpeed: number = 300;
    private minSpeed: number = 50;
    private acceleration: number = 1;
    private turnSpeed: number = 0.02;
    private pitchSpeed: number = 0.02;
    private rollSpeed: number = 0.1;
    private currentRoll: number = 0;

    constructor(scene: THREE.Scene) {
        this.mesh = new THREE.Group();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.speed = this.minSpeed;

        // Create airplane body
        const bodyGeometry = new THREE.ConeGeometry(5, 20, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = -Math.PI / 2;

        // Create wings
        const wingGeometry = new THREE.BoxGeometry(40, 2, 10);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.y = 2;

        // Create tail
        const tailGeometry = new THREE.BoxGeometry(10, 2, 5);
        const tailMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.z = -8;
        tail.position.y = 2;

        // Add all parts to the plane group
        this.mesh.add(body);
        this.mesh.add(wings);
        this.mesh.add(tail);

        // Initial position
        this.mesh.position.set(0, 100, 0);
        scene.add(this.mesh);
    }

    public update(): void {
        // Update position based on velocity
        this.mesh.position.add(this.velocity);

        // Update velocity based on current rotation and speed
        this.velocity.x = Math.sin(this.rotation.y) * this.speed;
        this.velocity.z = Math.cos(this.rotation.y) * this.speed;
        this.velocity.y = Math.sin(-this.rotation.x) * this.speed;

        // Apply rotation to mesh
        this.mesh.rotation.copy(this.rotation);

        // Apply roll (banking effect)
        this.currentRoll *= 0.95; // Gradually return to level
        this.mesh.rotation.z = this.currentRoll;

        // Apply gravity effect
        if (this.mesh.position.y > 0) {
            this.velocity.y -= 0.1;
        }

        // Prevent going below ground
        if (this.mesh.position.y < 0) {
            this.mesh.position.y = 0;
            this.velocity.y = 0;
        }
    }

    public handleInput(key: string): void {
        switch (key) {
            // Pitch controls (W/S or Arrow Up/Down)
            case 'w':
            case 'ArrowUp':
                this.rotation.x = Math.max(this.rotation.x - this.pitchSpeed, -Math.PI / 4);
                break;
            case 's':
            case 'ArrowDown':
                this.rotation.x = Math.min(this.rotation.x + this.pitchSpeed, Math.PI / 4);
                break;

            // Turn controls (A/D or Arrow Left/Right) - Reversed
            case 'a':
            case 'ArrowLeft':
                this.rotation.y += this.turnSpeed;
                this.currentRoll = Math.max(this.currentRoll - this.rollSpeed, -0.3);
                break;
            case 'd':
            case 'ArrowRight':
                this.rotation.y -= this.turnSpeed;
                this.currentRoll = Math.min(this.currentRoll + this.rollSpeed, 0.3);
                break;

            // Speed controls (Shift/Control)
            case 'Shift':
                this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
                break;
            case 'Control':
                this.speed = Math.max(this.speed - this.acceleration, this.minSpeed);
                break;
        }
    }

    public getPosition(): THREE.Vector3 {
        return this.mesh.position;
    }

    public getRotation(): THREE.Euler {
        return this.rotation;
    }

    public getSpeed(): number {
        return this.speed;
    }
} 