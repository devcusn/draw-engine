import DrawSystemStore from "./DrawStore";

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
}
export default CoordinateFeature;
