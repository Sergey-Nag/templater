import { CollectedDataFromDOM } from "../types/dom/Dom.types";
import { NodeValueData } from "../types/data/Data.type";

export interface DomInterface {
  element: HTMLElement;

  updateNodes(updateFrom: 'variables' | 'expressions', key: string, value: string | number | boolean): void;
  parseDom(element: HTMLElement, data?: CollectedDataFromDOM): CollectedDataFromDOM;
  run(): void;

}