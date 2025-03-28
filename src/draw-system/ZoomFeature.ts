import DrawSystemStore from "./DrawStore";

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
        this.store.setProperty("scale", newScale);
      } else {
        return;
      }

      this.store.setProperty("setOffsetX", mouseX - mouseXBeforeZoom * scale);
      this.store.setProperty("setOffsetY", mouseY - mouseYBeforeZoom * scale);
      this.store.reRender();
    });
  }
}
export default ZoomFeature;
