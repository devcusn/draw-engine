# Draw Engine

## Overview
A canvas-based drawing system that provides features for creating and manipulating points, polylines, and other geometric elements with support for panning, zooming, and grid visualization.

## Features
- Point creation in single or polyline mode
- Interactive canvas panning
- Zoom functionality
- Coordinate system visualization
- Grid system for precise positioning
- Extensible feature-based architecture

## Installation
```bash
# Clone the repository
git clone https://github.com/devcusn/draw-engine.git

# Navigate to the project directory
cd draw-engine

# Install dependencies (if using npm)
npm install
```

## Usage
Include the necessary HTML elements in your page:

```html
<canvas id="canvas"></canvas>
<button id="single-btn">Single Point</button>
<button id="polyline-btn">Polyline</button>
```

Initialize the drawing system:

```javascript
import CoordinateFeature from "./draw-system/CoordinateFeature";
import DrawEngine from "./draw-system/DrawEngine";
import DrawStore from "./draw-system/DrawStore";
import GridFeature from "./draw-system/GridFeature";
import PanFeature from "./draw-system/PanFeature";
import PointFeature from "./draw-system/PointFeature";
import ZoomFeature from "./draw-system/ZoomFeature";

const store = new DrawStore();

const drawEngine = new DrawEngine({
  store: store,
  features: {
    PointFeature: { feat: PointFeature, active: false },
    GridSystemFeature: { feat: GridFeature, active: true },
    ZoomFeature: { feat: ZoomFeature, active: true },
    PanFeature: { feat: PanFeature, active: true },
    CoordinateFeature: { feat: CoordinateFeature, active: true },
  },
});

drawEngine.init();
```

## Architecture

### Core Components

#### DrawStore
Central state management for the drawing system. Handles properties, feature instances, and rendering triggers.

#### DrawEngine
Main engine that initializes and coordinates all features. Manages the canvas context and event handling.

### Features

#### PointFeature
Handles the creation and rendering of individual points.

#### PanFeature
Enables canvas panning through mouse interactions:
```javascript
class PanFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  
  init = () => {
    // Sets up mouse event listeners for dragging the canvas
    this.canvas.addEventListener("mousedown", (event) => {
      const { setProperty } = this.store;
      const rect = this.canvas.getBoundingClientRect();
      setProperty("lastX", event.clientX - rect.left);
      setProperty("lastY", event.clientY - rect.top);
      setProperty("isDragging", true);
    });

    // Additional event listeners for mousemove, mouseup, mouseout
    // ...
  };
  
  render = () => {};
}
```

#### ZoomFeature
Provides zoom in/out functionality for the canvas.

#### GridFeature
Renders a grid system for better positioning and alignment.

#### CoordinateFeature
Displays coordinate information to help users understand positions.

## Extending With New Features
The system is designed to be extensible. To add a new feature:

1. Create a new feature class that follows the feature interface pattern
2. Add the feature to the DrawEngine initialization
3. Implement the necessary rendering and interaction methods

Example:
```javascript
class NewFeature {
  constructor(canvas, ctx, store) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.store = store;
  }
  
  init = () => {
    // Setup code
  };
  
  render = () => {
    // Render code
  };
}

// Add to DrawEngine configuration
const drawEngine = new DrawEngine({
  store: store,
  features: {
    // Existing features...
    NewFeature: { feat: NewFeature, active: true },
  },
});
```

## Event Handling
The system uses event listeners to handle user interactions:

- Mouse down: Start drawing or panning
- Mouse move: Continue drawing or panning
- Mouse up: End drawing or panning action
- Mouse wheel: Zoom in/out

## State Management
The DrawStore manages the application state, including:

- Canvas offset coordinates
- Zoom level
- Active tool selection
- Drawing in progress status
- Feature configuration

## License
[MIT License](LICENSE)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
