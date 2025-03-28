import DrawSystemStore from "./DrawStore";

class GridFeature {
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
  render() {
    this.drawGrid();
  }
  init() {
    this.drawGrid();
  }
}
export default GridFeature;
