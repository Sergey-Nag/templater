import { NODE_TYPE_STRING } from "../constants/Node.constants";
import { VARIABLE_NAME_REGEXP, VARIABLE_REGEXP } from "../constants/REgExp.constants";
import { DomInterface } from "../interfaces/Dom.interface";
import { CollectedDataFromDOM, CollectedVarData } from "../types/dom/Dom.types";
import {NodeValueData, TextByVariable } from "../types/data/Data.type";

export class DomModule implements DomInterface {
  // private nodes: MapNodes;
  private data: CollectedDataFromDOM;
  element: HTMLElement;

  constructor(elSelector: string) {
    this.element = document.querySelector(elSelector);
    this.data = {
      variables: null,
      expressions: null,
      directives: null,
    }
  }

  run() {
    this.data = this.parseDom();
  }
  
  parseDom(element: HTMLElement = this.element, data: CollectedDataFromDOM = this.data): CollectedDataFromDOM {
    const childNodes = [...element.childNodes as any];
    for (let node of childNodes) {
      const { nodeType } = node;
      if (nodeType === NODE_TYPE_STRING) {
          let matches = node.nodeValue.matchAll(VARIABLE_REGEXP);
          matches = Array.from(matches);
          data = matches.length > 0 ? this.parseTextNode(matches, node, data) : data;
      } else {
        data = this.parseDom(node, data);
      }
    }
    return data;
  }

  updateNodes(updateFrom: 'variables' | 'expressions', key: string, value: string | number | boolean): void {
    this.data[updateFrom][key].forEach((node: Text) => {
      node.data = value.toString();
    });
  }
    

    // getElement(selector: string) : HTMLElement {
    //     return document.querySelector(selector);
    // }

    // parseDown(element: HTMLElement = this.element) {
    //     const childNodes = [...element.childNodes as any];
    //     for (let el of childNodes) {
    //         const { nodeType } = el;
    //         if (nodeType === NODE_TYPE_STRING) {
    //             this.parseAsString(el);
    //         } else {
    //             this.parseDown(el);
    //         }
    //     }
    // }

  private parseTextNode(matches: RegExpMatchArray[], node: Text, collected: CollectedDataFromDOM = {variables: null, expressions: null}): CollectedDataFromDOM {
    let nodeOrObjectNode: Text | TextByVariable = node;
    if (matches.length > 1) nodeOrObjectNode = this.divideTextNode(matches, node);
    for (let match of matches) {
      let names: string[] = [match[1].trim()];
      const containsVariable = VARIABLE_NAME_REGEXP.test(names[0]);
      const nameDestination = containsVariable ? 'variables' : 'expressions';

      if (collected[nameDestination] === null) collected[nameDestination] = {};

      if (containsVariable) {
        const reg = new RegExp(VARIABLE_NAME_REGEXP, 'g');
        names = names[0].match(reg);
      }

      for (let name of names) {
        name = name.trim().replace(/ /g, '');
        node = nodeOrObjectNode instanceof Text ? node : nodeOrObjectNode[name];
        if (collected[nameDestination][name]) collected[nameDestination][name].push(node);
        else collected[nameDestination][name] = [node];
      }
    }
    return collected;
  }

  private divideTextNode(matches: RegExpMatchArray[], node: Text): TextByVariable {
    const result: TextByVariable = {};
    let newNode = node;    
    for (let match of matches.sort((a, b) => b.index - a.index)) {
      const name = match[1].trim(),
        offset = match.index;
      newNode = node.splitText(offset)
      newNode.splitText(match[0].length);
      result[name] = newNode;
    }
    return result;
  }

    // updateNode(node: Text) {
    //     this.nodes.set(node, this.nodes.get(node).map(([n, prevVal, startAt, valueData] : NodeValueData, i: number, nodes: NodeValueData[]) => {
    //         const newValue = valueData.value?.toString();
    //         if (newValue === undefined || newValue === null || newValue === prevVal) return [n, prevVal, startAt, valueData];
            
    //         const positionDiference = this.replaceNodeText(n, prevVal, newValue, startAt);

    //         if (positionDiference !== 0){
    //             this.moveIndexes(nodes, positionDiference, i);
    //         }

    //         return [n, newValue, startAt, valueData];
    //     }));
    // }
    
    // moveIndexes(nodes: NodeValueData[], difference: number, index: number) {
    //     for (let i = index; i < nodes.length; i++) {
    //         nodes[i][2] = nodes[i][2] - difference;            
    //     }
    // }
    
    /**
     * Replace old value to new value from start position and return the position differences
     * @returns the position differences
     */
    // replaceNodeText(node: Text, prevValue: string, newValue: string, startAt: number):number {
    //     const prevLength = prevValue.length;
    //     const beforeValueString = node.data.substring(0, startAt);
    //     const afterValueString = node.data.substring(startAt + prevLength);

    //     node.data = beforeValueString + newValue + afterValueString;

    //     return (prevLength - newValue.length);
    // }

    // getNodes() {
    //     return this.nodes;
    // }
}