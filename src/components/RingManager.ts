import * as THREE from 'three';

interface Ring {
    mesh: THREE.Mesh;
    collected: boolean;
}

export class RingManager {
    private rings: Ring[];
    private scene: THREE.Scene;
    private ringGeometry: THREE.TorusGeometry;
    private ringMaterial: THREE.MeshPhongMaterial;
    private maxRings: number = 10;
    private spawnDistance: number = 1000;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.rings = [];

        // Create ring geometry and material
        this.ringGeometry = new THREE.TorusGeometry(30, 3, 16, 100);
        this.ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0x666600,
            shininess: 100
        });

        // Create initial rings
        this.spawnRings();
    }

    private spawnRings(): void {
        while (this.rings.length < this.maxRings) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.spawnDistance;
            
            const ring = new THREE.Mesh(this.ringGeometry, this.ringMaterial);
            
            // Position the ring
            ring.position.x = Math.sin(angle) * distance;
            ring.position.z = Math.cos(angle) * distance;
            ring.position.y = 100 + Math.random() * 200; // Random height between 100 and 300
            
            // Random rotation
            ring.rotation.x = Math.random() * Math.PI / 4;
            ring.rotation.y = Math.random() * Math.PI * 2;
            
            ring.castShadow = true;
            ring.receiveShadow = true;
            
            this.scene.add(ring);
            this.rings.push({
                mesh: ring,
                collected: false
            });
        }
    }

    public update(playerPosition: THREE.Vector3): void {
        // Remove collected rings and spawn new ones
        this.rings = this.rings.filter(ring => {
            if (ring.collected) {
                this.scene.remove(ring.mesh);
                ring.mesh.geometry.dispose();
                ring.mesh.material.dispose();
                return false;
            }
            return true;
        });

        // Spawn new rings if needed
        this.spawnRings();

        // Make rings slowly rotate
        this.rings.forEach(ring => {
            ring.mesh.rotation.y += 0.01;
        });
    }

    public checkCollisions(playerPosition: THREE.Vector3): boolean {
        let collisionDetected = false;
        
        this.rings.forEach(ring => {
            if (!ring.collected) {
                const distance = playerPosition.distanceTo(ring.mesh.position);
                
                if (distance < 30) { // Ring radius is 30
                    ring.collected = true;
                    collisionDetected = true;
                    
                    // Create collection effect
                    const particles = new THREE.Points(
                        new THREE.BufferGeometry().setFromPoints(
                            Array(50).fill(null).map(() => {
                                const particle = new THREE.Vector3(
                                    (Math.random() - 0.5) * 20,
                                    (Math.random() - 0.5) * 20,
                                    (Math.random() - 0.5) * 20
                                );
                                return particle.add(ring.mesh.position);
                            })
                        ),
                        new THREE.PointsMaterial({
                            color: 0xffff00,
                            size: 2,
                            transparent: true,
                            opacity: 1
                        })
                    );
                    
                    this.scene.add(particles);
                    
                    // Remove particles after animation
                    setTimeout(() => {
                        this.scene.remove(particles);
                        particles.geometry.dispose();
                        (particles.material as THREE.Material).dispose();
                    }, 1000);
                }
            }
        });
        
        return collisionDetected;
    }
} 