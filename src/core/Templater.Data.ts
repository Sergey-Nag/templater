import { EventEmitter } from "../modules/EventEmitter";
import { NodeValueData, TrackedData, ValueData } from "../types/templater/data.type";

export class TemplaterData {
    data = {};
    private Data: TrackedData = {};
    $event: EventEmitter;

    constructor() {
        this.$event = EventEmitter.getInstance();
    }

    addDataProperty(key: string, value?: any, node?: Text, startAt?: number): ValueData {
        if (this.Data[key]) {
            this.Data[key].nodes.push([node, null, startAt]);
        } else {
            this.Data[key] = {
                name: key,
                value: value,
                nodes: node && startAt ? [node, value, startAt] : [],
            }
        }
        return this.Data[key];
    }

    updateDataProperty(key:string, value: any) {
        if (this.Data[key] && this.Data[key].value === value) {
            return;
        } else if (this.Data[key]) {
            this.Data[key].value = value;
        } else {
            this.addDataProperty(key, value);
        }
        this.updateAllNodes(this.Data[key]);
    }

    initData(data: object) : object {
        const dynamicData = {};
        for (let key in data) {
            this.addDataProperty(key, (data as any)[key]);
            Object.defineProperty(dynamicData, key, {
                get: () => this.Data[key].value,
                set: (value: any) => this.updateDataProperty(key, value),
            });
        }
        return dynamicData;
    }

    updateAllNodes(valueObj: ValueData) {
        console.log(valueObj);
        valueObj.nodes.forEach(([node]: NodeValueData) => {
            this.$event.emit('dom:updateNode', node);
        });    
    }

    getData(): TrackedData {
        return {...this.Data};
    }
}