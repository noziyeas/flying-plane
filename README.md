# Flying Plane Game

A 3D flying plane game built with Three.js where you navigate through rings in an infinite terrain.

## Features

- 3D plane with realistic controls
- Infinite terrain generation
- Floating rings to collect
- Score tracking
- Particle effects when collecting rings

## Controls

- Arrow Up/Down: Pitch control (nose up/down)
- Arrow Left/Right: Turn left/right
- W: Increase speed
- S: Decrease speed

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser and navigate to `http://localhost:3000`

## Development

This game is built with:
- Three.js for 3D graphics
- TypeScript for type safety
- Vite for fast development and building

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Plane.ts       # Plane physics and controls
│   │   ├── Terrain.ts     # Infinite terrain generation
│   │   └── RingManager.ts # Ring spawning and collection
│   └── main.ts           # Game initialization
├── public/
│   └── textures/         # Game textures
└── index.html           # Entry point
``` 