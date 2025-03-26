class DrawSystemStore {
  constructor() {}
  shapes = [{ x: 100, y: 100 }];
  features = {};
  properties = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    gridSize: 50,
    gridLineWidth: 1,
    gridLineColor: "#202020",
  };
  setPropery = (property: string, value: any) => {
    this.properties[property] = value;
  };
  reRender = () => {};
  addShape(shape: any) {
    this.shapes.push(shape);
  }
  addFeature(feature: string, value: any) {
    this.features[feature] = value;
  }

  reInit() {}
}

class AddPointFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  drawPoint(point) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.closePath();
    this.store.addShape(point);
  }
  init() {
    this.canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const point = { x, y };
      this.drawPoint(point);
    });
  }
  reInit() {
    this.store.shapes.forEach((shape) => {
      this.drawPoint(shape);
    });
  }
}

class GridSystemFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}

  drawGrid = () => {
    const { scale, offsetX, offsetY, gridSize, gridLineWidth, gridLineColor } =
      this.store.properties;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();

    this.ctx.translate(offsetX, offsetY);
    this.ctx.scale(scale, scale);

    const startCol = Math.floor(-offsetX / (gridSize * scale));
    const endCol =
      startCol + Math.ceil(this.canvas.width / (gridSize * scale)) + 1;
    const startRow = Math.floor(-offsetY / (gridSize * scale));
    const endRow =
      startRow + Math.ceil(this.canvas.height / (gridSize * scale)) + 1;

    this.ctx.beginPath();
    this.ctx.lineWidth = gridLineWidth / scale;
    this.ctx.strokeStyle = gridLineColor;

    for (let col = startCol; col <= endCol; col++) {
      const x = col * gridSize;
      this.ctx.moveTo(x, startRow * gridSize);
      this.ctx.lineTo(x, endRow * gridSize);
    }

    for (let row = startRow; row <= endRow; row++) {
      const y = row * gridSize;
      this.ctx.moveTo(startCol * gridSize, y);
      this.ctx.lineTo(endCol * gridSize, y);
    }

    this.ctx.stroke();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.font = `${12 / scale}px Arial`;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        // const x = col * gridSize;
        // const y = row * gridSize;
        // this.ctx.fillText(
        //   `${col * gridSize}, ${row * gridSize}`,
        //   x + 5,
        //   y + 15
        // );
      }
    }

    this.ctx.restore();
  };

  init() {
    this.store.reRender = this.drawGrid;
    this.drawGrid();
  }
  reInit() {
    this.init();
  }
}

type DrawSystemConstructor = {
  store: DrawSystemStore;
  features: Array<any>;
};
class DrawSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  store: DrawSystemStore;
  features: Array<any>;
  constructor({ store, features }: DrawSystemConstructor) {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.store = store;
    this.features = features;
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    Object.entries(this.store.features).forEach((feature) => {
      console.log(feature[1]);
      feature[1].reInit();
    });
  }

  init() {
    this.resizeCanvas();
    let resizeTimeout: any;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 100);
    });

    this.features.forEach((Feature) => {
      const ext = new Feature(this.canvas, this.ctx, store);
      ext.init();
      this.store.addFeature(ext.constructor.name, ext);
    });
  }
}
class PanFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  init() {
    this.canvas.addEventListener(
      "mousedown",
      function (event) {
        const { setPropery } = this.store;
        const rect = this.canvas.getBoundingClientRect();
        setPropery("lastX", event.clientX - rect.left);
        setPropery("lastY", event.clientY - rect.top);
        setPropery("isDragging", true);
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mousemove",
      function (event) {
        const { properties, setPropery, reRender } = this.store;
        const { lastX, lastY, isDragging, offsetX, offsetY } = properties;

        if (isDragging) {
          const rect = this.canvas.getBoundingClientRect();

          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;
          const dx = mouseX - lastX;
          const dy = mouseY - lastY;

          setPropery("offsetX", offsetX + dx);
          setPropery("offsetY", offsetY + dy);

          setPropery("lastX", mouseX);
          setPropery("lastY", mouseY);
          console.log(lastX, lastY, offsetX, offsetY);
          reRender();
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseup",
      function () {
        const { setPropery } = this.store;
        setPropery("isDragging", false);
        this.canvas.style.cursor = "grab";
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseout",
      function () {
        const { setPropery } = this.store;
        setPropery("isDragging", false);
      }.bind(this)
    );

    this.canvas.style.cursor = "grab";
  }
}
class ZoomFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  init() {
    const properties = this.store.properties;

    this.canvas.addEventListener("wheel", (event) => {
      const { offsetX, offsetY, scale } = properties;
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const mouseXBeforeZoom = (mouseX - offsetX) / scale;
      const mouseYBeforeZoom = (mouseY - offsetY) / scale;

      const zoomIntensity = 0.1;
      const zoom = event.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

      const newScale = scale * zoom;
      if (newScale > 0.1 && newScale < 5) {
        this.store.setPropery("scale", newScale);
      } else {
        return;
      }

      this.store.setPropery("setOffsetX", mouseX - mouseXBeforeZoom * scale);
      this.store.setPropery("setOffsetY", mouseY - mouseYBeforeZoom * scale);
      this.store.reRender();
    });
  }
}

class CoordinateFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}

  drawCoordinates = () => {
    const { scale, offsetX, offsetY, gridSize } = this.store.properties;

    this.ctx.save();

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "#000000";

    const startCol = Math.floor(-offsetX / (gridSize * scale));
    const endCol =
      startCol + Math.ceil(this.canvas.width / (gridSize * scale)) + 1;
    const startRow = Math.floor(-offsetY / (gridSize * scale));
    const endRow =
      startRow + Math.ceil(this.canvas.height / (gridSize * scale)) + 1;

    const yPosition = this.canvas.height - 5;
    for (let col = startCol; col <= endCol; col += 1) {
      if (col % 5 === 0) {
        const x = col * gridSize * scale + offsetX;

        if (x >= 0 && x <= this.canvas.width) {
          this.ctx.fillText(`${col * gridSize}`, x, yPosition);
        }
      }
    }

    const xPosition = 10;
    for (let row = startRow; row <= endRow; row += 1) {
      if (row % 5 === 0) {
        const y = row * gridSize * scale + offsetY;

        if (y >= 0 && y <= this.canvas.height) {
          this.ctx.fillText(`${row * gridSize}`, xPosition, y);
        }
      }
    }

    this.ctx.restore();
  };

  init() {
    const originalRender = this.store.reRender;

    this.store.reRender = () => {
      originalRender();
      this.store.shapes.forEach((shape) => {
        this.ctx.fillStyle = "blue"; // Set the fill color
        this.ctx.fillRect(
          this.store.properties.offsetX,
          this.store.properties.offsetY,
          100 * this.store.properties.scale,
          100 * this.store.properties.scale
        ); // Draw the square
      });
      this.drawCoordinates();
    };

    this.drawCoordinates();
  }

  reInit() {
    this.drawCoordinates();
  }
}

const store = new DrawSystemStore();

const drawSystem = new DrawSystem({
  store: store,
  features: [
    AddPointFeature,
    GridSystemFeature,
    ZoomFeature,
    PanFeature,
    CoordinateFeature,
  ],
});

drawSystem.init();
