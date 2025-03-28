import { PropertiesType } from "./types";

class DrawStore {
  constructor() {}
  shapes = [{ x: 100, y: 100 }];
  featuresInstance: { [fi: string]: object } = {};
  properties: PropertiesType = {
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
  events = {
    click: (event: MouseEvent) => {},
  };
  setProperty = (property: string, value: string | number | boolean) => {
    this.properties[property] = value;
  };
  updateEvent = (eventName: "click", func: (event: unknown) => void) => {
    this.events[eventName] = func;
  };
  reRender = () => {};
  addShape(shape: any) {
    this.shapes.push(shape);
  }
  addFeature(feature: string, value: any) {
    this.featuresInstance[feature] = value;
  }
}

export default DrawStore;
