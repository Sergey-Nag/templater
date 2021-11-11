import { EventEmitter } from "../modules/EventEmitter";
import { Config } from "../types/templater/Config.type";
import { NodeValueData } from "../types/templater/data.type";
import { TemplaterData } from "./Templater.Data";
import { TemplaterDOM } from "./Templater.DOM";

export class Templater extends TemplaterDOM {
    element: HTMLElement;
    public el: string;
    $event: EventEmitter;

    constructor({ el, data }: Config) {
        super();
        this.el = el;
        this.data = this.initData(data);
        this.element = this.getElement(el);
        this.$event = EventEmitter.getInstance();
    }

    run() {
        this.parseDown();
        // this.updateNodeValue();
        // console.log(this.getData());
        console.log(this.getNodes());
        
    }
}