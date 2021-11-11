import { NODE_TYPE_STRING } from "../constants/Node.constants";
import { VARIABLE_REGEXP } from "../constants/Text.constants";
import { EventEmitter } from "../modules/EventEmitter";
import { MapNodes, NodeValueData } from "../types/templater/data.type";
import { TemplaterData } from "./Templater.Data";

export class TemplaterDOM extends TemplaterData {
    private nodes: MapNodes;
    element: HTMLElement;
    $event: EventEmitter;
    
    constructor() {
        super();
        this.nodes = new Map();
        this.$event = EventEmitter.getInstance();

        this.$event.on('dom:updateNode', this.updateNode.bind(this));
    }

    getElement(selector: string) : HTMLElement {
        return document.querySelector(selector);
    }

    parseDown(element: HTMLElement = this.element) {
        const childNodes = [...element.childNodes as any];
        for (let el of childNodes) {
            const { nodeType } = el;
            if (nodeType === NODE_TYPE_STRING) {
                this.parseAsString(el);
            } else {
                this.parseDown(el);
            }
        }
    }

    private parseAsString(node: Text) {
        const matches = node.nodeValue.matchAll(VARIABLE_REGEXP);
        if (!matches) return;
        for (let match of Array.from(matches)) {
            const name = match[1].trim(),
                index = match.index;
            
            const prop = this.addDataProperty(name, null, node, index);

            this.nodes.set(node, this.nodes.get(node) ? [...this.nodes.get(node), [node, match[0], index, prop]] : [[node, match[0], index, prop]])
        }
    }

    updateNode(node: Text) {
        this.nodes.set(node, this.nodes.get(node).map(([n, prevVal, startAt, valueData] : NodeValueData, i: number, nodes: NodeValueData[]) => {
            const newValue = valueData.value?.toString();
            if (newValue === undefined || newValue === null || newValue === prevVal) return [n, prevVal, startAt, valueData];
            
            const positionDiference = this.replaceNodeText(n, prevVal, newValue, startAt);

            if (positionDiference !== 0){
                this.moveIndexes(nodes, positionDiference, i);
            }

            return [n, newValue, startAt, valueData];
        }));
    }
    moveIndexes(nodes: NodeValueData[], difference: number, index: number) {
        for (let i = index; i < nodes.length; i++) {
            nodes[i][2] = nodes[i][2] - difference;            
        }
    }
    
    /**
     * Replace old value to new value from start position and return the position differences
     * @returns the position differences
     */
    replaceNodeText(node: Text, prevValue: string, newValue: string, startAt: number):number {
        const prevLength = prevValue.length;
        const beforeValueString = node.data.substring(0, startAt);
        const afterValueString = node.data.substring(startAt + prevLength);

        node.data = beforeValueString + newValue + afterValueString;

        return (prevLength - newValue.length);
    }

    getNodes() {
        return this.nodes;
    }
}