import DrawSystemStore from "./DrawStore";

type DrawSystemConstructor = {
  store: DrawSystemStore;
  features: {};
};

class DrawEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  store: DrawSystemStore;
  features: { [key: string]: { feat: any; active: boolean } };

  constructor({ store, features }: DrawSystemConstructor) {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.store = store;
    this.features = features;
  }

  onClick = () => {
    this.canvas.addEventListener("click", (event) => {
      this.store.events.click(event);
    });
  };

  onResize = () => {
    this.resizeCanvas();
    let resizeTimeout: any;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 100);
    });
  };

  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    (
      Object.entries(this.store.featuresInstance) as Array<
        [string, { init: () => void }]
      >
    ).forEach((feature) => {
      feature[1].init();
    });
  }

  eventListeners = () => {
    this.onClick();
    this.onResize();
  };

  init() {
    const featureEntries = Object.entries(this.features);
    featureEntries.forEach((feat) => {
      const Feat = feat[1].feat;
      const feature = new Feat(this.canvas, this.ctx, this.store);
      const isFeatActive = feat[1].active;
      if (isFeatActive) {
        feature.init();
      }
      this.store.addFeature(feature.constructor.name, feature);
    });
    // update click event
    this.store.updateEvent("click", () => {
      console.log("updated events");
    });
    this.eventListeners();
  }
}

export default DrawEngine;
