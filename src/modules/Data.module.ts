import { DomInterface } from "../interfaces/Dom.interface";
import { NodeValueData, TrackedData, ValueData } from "../types/data/Data.type";

export class DataModule {
    private data: TrackedData = {};
    private updateView: DomInterface["updateNodes"];
    // $event: EventEmitterModule;

    constructor() {
        // this.$event = EventEmitterModule.getInstance();
    }

    addDataProperty(key: string, value?: any): ValueData {
        this.data[key] = {
            name: key,
            value: value,
        }
        return this.data[key];
    }

    updateDataProperty(key:string, value: any, updateNodeCallback: DomInterface["updateNodes"]) {
        if (this.data[key] && this.data[key].value === value) {
            return;
        } else if (this.data[key]) {
            this.data[key].value = value;
        } else {
            this.addDataProperty(key, value);
        }
        updateNodeCallback('variables', key, value);
    }

    initData(data: object, updateNodeCallback: DomInterface["updateNodes"]) : object {
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

    run() {
        for (let variable in this.data) {
            this.updateView('variables', variable, this.data[variable].value);
        }
    }

    // updateAllNodes(valueObj: ValueData) {
    //     console.log(valueObj);
    //     valueObj.nodes.forEach(([node]: NodeValueData) => {
    //         // this.$event.emit('dom:updateNode', node);
    //     });    
    // }

    // getData(): TrackedData {
    //     return {...this.Data};
    // }
}