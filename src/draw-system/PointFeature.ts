import DrawSystemStore from "./DrawStore";

class PointFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  drawPoint(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const point = { x, y };
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.closePath();
    this.store.addShape(point);
  }
  init() {
    this.canvas.addEventListener("click", (event) => {
      this.store.updateEvent("click", (event: MouseEvent) => {
        this.drawPoint(event);
      });
    });
  }
}

export default PointFeature;
