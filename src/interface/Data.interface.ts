import { TrackedData, ValueData } from "../types/data/Data.type";
import { DomInterface } from "./Dom.interface";

export interface DataInterface {
  initData(data: object, updateNodeCallback: Function) : object
  addDataProperty(key: string, value?: any): ValueData;
  updateDataProperty(key:string, value: any, updateNodeCallback: Function): void
  getTrackedData(key?: string): TrackedData | ValueData;
  run():void
}