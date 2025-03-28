import CoordinateFeature from "./draw-system/CoordinateFeature";
import DrawEngine from "./draw-system/DrawEngine";
import DrawStore from "./draw-system/DrawStore";
import GridFeature from "./draw-system/GridFeature";
import PanFeature from "./draw-system/PanFeature";
import PointFeature from "./draw-system/PointFeature";
import ZoomFeature from "./draw-system/ZoomFeature";

const singleBtn = document.getElementById("single-btn") as HTMLButtonElement;
const polylineBtn = document.getElementById(
  "polyline-btn"
) as HTMLButtonElement;

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

singleBtn.addEventListener("click", () => {
  console.log(drawEngine.store.features);
});
polylineBtn.addEventListener("click", () => {
  console.log("polyline");
});
