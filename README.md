# GEOSCRATCH

A 3D geometry learning platform built with React, Three.js, and Blockly. Features interactive 3D visualization and visual programming for mathematical concepts.

## Features

- 🎯 Interactive 3D geometry visualization
- 🧩 Visual programming with Blockly
- 💡 Animated guidance system with Framer Motion
- 📚 Math guides and examples
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **Visual Programming**: Blockly
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GeoScratch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will automatically install all required packages including:
   - `framer-motion` - For smooth animations
   - `three` - For 3D graphics
   - `blockly` - For visual programming
   - `@fortawesome/react-fontawesome` - For icons

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header/           # Navigation and guidance
│   ├── Scene3D/          # 3D visualization
│   ├── BlocksCanvas/     # Visual programming interface
│   └── GuidePopup.jsx    # Math guidance popup
├── store/                # Zustand state management
├── utils/                # Helper functions
└── assets/               # Icons and images
```

## Key Features

### 🎯 Animated Guidance System
- Lightbulb button with Framer Motion animations
- Auto-starts when users visit the page
- Stops after 10 seconds or when clicked
- Provides math concept explanations

### 🧩 Visual Programming
- Drag-and-drop block programming
- Mathematical operations and 3D geometry
- Real-time 3D visualization

### 📚 Learning Resources
- Interactive math guides
- Step-by-step examples
- External learning links

## Dependencies

All dependencies are listed in `package.json`. Key packages include:

- `framer-motion@^12.23.22` - Smooth animations
- `three@^0.179.1` - 3D graphics library
- `blockly@^12.2.0` - Visual programming
- `react@^19.1.1` - UI framework
- `tailwindcss@^4.1.12` - Styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

