import { VARIABLE_NAME_REGEXP_ALL } from "../constants/REgExp.constants";
import { DataInterface } from "../interface/Data.interface";
import { NodeValueData, TrackedData, ValueData } from "../types/data/Data.type";
import { EventEmitterModule } from "./EventEmitter.module";

export class DataModule implements DataInterface {
  private data: TrackedData = {};
  private updateView: Function;
  // private updateView: DomInterface["updateNodes"];
  private $event: EventEmitterModule;

  constructor() {
    this.$event = EventEmitterModule.getInstance();

  }

  addDataProperty(key: string, value?: any): ValueData {
    this.data[key] = {
      name: key,
      value: value,
    }
    return this.data[key];
  }

  updateDataProperty(key:string, value: any, updateNodeCallback: Function) {
    if (this.data[key] && this.data[key].value === value) {
      return;
    } else if (this.data[key]) {
      this.data[key].value = value;
    } else {
      this.addDataProperty(key, value);
    }
    updateNodeCallback('variables', key);
  }

  initData(data: object, updateNodeCallback: Function) : TrackedData {
    const dynamicData = {};
    this.updateView = updateNodeCallback;
    for (let key in data) {
      this.addDataProperty(key, (data as any)[key]);
      Object.defineProperty(dynamicData, key, {
        get: () => this.data[key].value,
        set: (value: any) => this.updateDataProperty(key, value, updateNodeCallback),
      });
    }
    return dynamicData;
  }

  getTrackedData(key?: string): TrackedData | ValueData {
    return {...(key ? this.data[key] : this.data)};
  }
  
  run() {
    for (let variable in this.data) {
      this.updateView('variables', variable, this.data[variable].value);
    }
  }
}