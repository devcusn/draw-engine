import DrawSystemStore from "./DrawStore";

class ExampleFeature {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private store: DrawSystemStore
  ) {}

  // This function is called when the feature is activated
  init() {
    this.store.updateEvent("click", (event: MouseEvent) => {
      console.log("ExampleFeature click event");
    });
  }
  render = () => {
    console.log("rendering ExampleFeature");
  };
}

export default ExampleFeature;
