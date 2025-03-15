import * as THREE from 'three';

export class Terrain {
    private chunks: Map<string, THREE.Mesh>;
    private chunkSize: number;
    private scene: THREE.Scene;
    private viewDistance: number;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.chunkSize = 2000; // Increased chunk size
        this.viewDistance = 3; // How many chunks to render in each direction

        // Create ground material with plain green color
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5e1e, // Dark green color
            roughness: 0.8,
            metalness: 0.2
        });

        // Create initial chunks around origin
        for (let x = -this.viewDistance; x <= this.viewDistance; x++) {
            for (let z = -this.viewDistance; z <= this.viewDistance; z++) {
                this.createChunk(x, z, groundMaterial);
            }
        }
    }

    private createChunk(x: number, z: number, material: THREE.Material): void {
        const chunkId = `${x},${z}`;
        if (this.chunks.has(chunkId)) return;

        const geometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(
            x * this.chunkSize,
            0,
            z * this.chunkSize
        );
        
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.chunks.set(chunkId, mesh);
    }

    public update(playerPosition: THREE.Vector3): void {
        // Calculate current chunk coordinates
        const currentChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const currentChunkZ = Math.floor(playerPosition.z / this.chunkSize);

        // Create new chunks in view distance and remove far chunks
        for (let x = currentChunkX - this.viewDistance; x <= currentChunkX + this.viewDistance; x++) {
            for (let z = currentChunkZ - this.viewDistance; z <= currentChunkZ + this.viewDistance; z++) {
                const chunkId = `${x},${z}`;
                if (!this.chunks.has(chunkId)) {
                    const groundMaterial = new THREE.MeshStandardMaterial({
                        color: 0x2d5e1e, // Dark green color
                        roughness: 0.8,
                        metalness: 0.2
                    });
                    this.createChunk(x, z, groundMaterial);
                }
            }
        }

        // Remove chunks that are too far
        this.chunks.forEach((mesh, id) => {
            const [chunkX, chunkZ] = id.split(',').map(Number);
            if (Math.abs(chunkX - currentChunkX) > this.viewDistance || 
                Math.abs(chunkZ - currentChunkZ) > this.viewDistance) {
                this.scene.remove(mesh);
                mesh.geometry.dispose();
                (mesh.material as THREE.Material).dispose();
                this.chunks.delete(id);
            }
        });
    }
} 