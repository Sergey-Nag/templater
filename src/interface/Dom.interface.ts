import { CollectedDataFromDOM } from "../types/dom/Dom.types";
import { NodeValueData, TrackedData } from "../types/data/Data.type";

export interface DomInterface {
  element: HTMLElement;
  
  getInitialData(): {[name: string]: any };
  updateNodes(updateFrom: 'variables' | 'expressions', key: string): void;
  parseDom(element: HTMLElement, data?: CollectedDataFromDOM): CollectedDataFromDOM;
  eval(evalString: string): any;
  run(): void;
}