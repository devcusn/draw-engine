import DrawSystemStore from "./DrawStore";

class PanFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}
  init = () => {
    this.canvas.addEventListener("mousedown", (event) => {
      const { setProperty } = this.store;
      const rect = this.canvas.getBoundingClientRect();
      setProperty("lastX", event.clientX - rect.left);
      setProperty("lastY", event.clientY - rect.top);
      setProperty("isDragging", true);
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const { properties, setProperty, reRender } = this.store;
      const { lastX, lastY, isDragging, offsetX, offsetY } = properties;

      if (isDragging) {
        const rect = this.canvas.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;

        setProperty("offsetX", offsetX + dx);
        setProperty("offsetY", offsetY + dy);

        setProperty("lastX", mouseX);
        setProperty("lastY", mouseY);
        console.log(lastX, lastY, offsetX, offsetY);
        reRender();
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      const { setProperty } = this.store;
      setProperty("isDragging", false);
      this.canvas.style.cursor = "grab";
    });

    this.canvas.addEventListener("mouseout", () => {
      const { setProperty } = this.store;
      setProperty("isDragging", false);
    });

    this.canvas.style.cursor = "grab";
  };
}
export default PanFeature;
