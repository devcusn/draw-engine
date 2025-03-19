class DrawSystemStore {
  constructor() {}
  shapes = [];
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
  renderGrid = () => {};
  addShape(shape: any) {
    this.shapes.push(shape);
  }
  addFeature(feature: string, value: any) {
    this.features[feature] = value;
  }

  reInit() {}
}

class AddPointExtension {
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

class GridSystemExtension {
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
      for (let col = startCol; col <= endCol; col++) {}
    }

    this.ctx.restore();
  };

  init() {
    this.store.renderGrid = this.drawGrid;
    this.drawGrid();
  }
  reInit() {
    this.init();
  }
}

type DrawSystemConstructor = {
  store: DrawSystemStore;
  extensions: Array<any>;
};
class DrawSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  store: DrawSystemStore;
  extensions: Array<any>;
  constructor({ store, extensions }: DrawSystemConstructor) {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.store = store;
    this.extensions = extensions;
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

    this.extensions.forEach((Extension) => {
      const ext = new Extension(this.canvas, this.ctx, store);
      ext.init();
      this.store.addFeature(ext.constructor.name, ext);
    });
  }
}
class PanFeauture {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  init() {
    const { properties, setPropery, renderGrid } = this.store;

    this.canvas.addEventListener("mousedown", function (event) {
      const rect = canvas.getBoundingClientRect();
      setPropery("lastX", event.clientX - rect.left);
      setPropery("lastY", event.clientY - rect.top);
      setPropery("isDragging", true);
    });

    this.canvas.addEventListener(
      "mousemove",
      function (event) {
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
          renderGrid();
        }
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseup",
      function () {
        setPropery("isDragging", false);
        this.canvas.style.cursor = "grab";
      }.bind(this)
    );

    this.canvas.addEventListener(
      "mouseout",
      function () {
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
      this.store.renderGrid();
    });
  }
}

const store = new DrawSystemStore();

const drawSystem = new DrawSystem({
  store: store,
  extensions: [
    AddPointExtension,
    GridSystemExtension,
    ZoomFeature,
    PanFeauture,
  ],
});

drawSystem.init();
