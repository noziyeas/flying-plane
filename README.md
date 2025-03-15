# Flying Plane Game

A 3D flying plane game built with Three.js where you navigate through rings in an infinite terrain.

🎮 [Play the Game](https://noziyeas.github.io/flying-plane/)

## Features

- 3D plane with realistic controls and banking effects
- Infinite terrain generation
- Floating rings to collect
- Score tracking
- Particle effects when collecting rings
- Responsive design that works on any screen size

## Controls

- **W** or **↑** : Pitch Up (nose up)
- **S** or **↓** : Pitch Down (nose down)
- **A** or **←** : Turn Right
- **D** or **→** : Turn Left
- **Shift** : Increase Speed
- **Control** : Decrease Speed

## Game Objectives

1. Navigate through the floating rings to score points
2. Each ring collected gives you 10 points
3. Try to maintain altitude while collecting rings
4. Challenge yourself to get the highest score!

## Installation

1. Clone this repository:
```bash
git clone https://github.com/noziyeas/flying-plane.git
```

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

## Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating a new branch for your feature
3. Submitting a pull request

## License

This project is licensed under the MIT License. 