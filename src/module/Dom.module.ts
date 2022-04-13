import { NODE_TYPE_STRING } from "../constant/Node.constants";
import { VARIABLE_NAME_REGEXP, VARIABLE_NAME_REGEXP_ALL, VARIABLE_REGEXP } from "../constant/REgExp.constants";
import { DomInterface } from "../interface/Dom.interface";
import { CollectedDataFromDOM } from "../types/dom/Dom.types";
import {TextByVariable } from "../types/data/Data.type";
import { EventEmitterModule } from "./EventEmitter.module";

export class DomModule implements DomInterface {
  private data: CollectedDataFromDOM;
  getInitialData: () => {[name: string]: any };
  element: HTMLElement;
  private $event: EventEmitterModule;

  constructor(elSelector: string, getData: DomInterface['getInitialData']) {
    this.element = document.querySelector(elSelector);
    this.data = {
      variables: null,
      expressions: null,
      directives: null,
    }
    this.getInitialData = getData;
    this.$event = EventEmitterModule.getInstance();
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

  updateNodes(updateFrom: 'variables' | 'expressions', key: string) {
    this.data[updateFrom][key].forEach(([node, expression]) => {
      node.data = this.eval(expression);
    });
  }

  private parseTextNode(matches: RegExpMatchArray[], node: Text, collected: CollectedDataFromDOM = {variables: null, expressions: null}): CollectedDataFromDOM {
    const objectNode: TextByVariable = this.divideTextNode(matches, node);
    for (let match of matches) {
      let names: string[] = [match[1].trim()];
      const containsVariable = VARIABLE_NAME_REGEXP.test(names[0]);
      const nameDestination = containsVariable ? 'variables' : 'expressions';

      if (collected[nameDestination] === null) collected[nameDestination] = {};

      if (containsVariable) {
        names = this.getDataVariablesFromString(names[0]);
      }

      for (let name of names) {
        if (collected[nameDestination][name]) collected[nameDestination][name].push(objectNode[name]);
        else collected[nameDestination][name] = [objectNode[name]];
      }
    }
    return collected;
  }

  private getDataVariablesFromString(string: string): string[] {
    const matches = string.match(VARIABLE_NAME_REGEXP_ALL);
    if (!matches) return [string];
    const dataKeys = Object.keys(this.getInitialData());
    // console.log(dataKeys, matches);
    
    return matches.filter((match) => dataKeys.includes(match));
  }

  private divideTextNode(matches: RegExpMatchArray[], node: Text): TextByVariable {
    const result: TextByVariable = {};
    let newNode = node;    
    for (let match of matches.sort((a, b) => b.index - a.index)) {
      
      const names = this.getDataVariablesFromString(match[1].trim()),
        offset = match.index;
      newNode = node.splitText(offset)
      newNode.splitText(match[0].length);

      // console.log(newNode, match);
      for (let name of names) {
        result[name] = [newNode, match[1]];
      }
    }
    return result;
  }
  
  eval(evalString: string) {
    let data: {keys: string[], values: any[]} = { keys: [], values: [] };
    let funcString = `return (${evalString})`;
    const variables = evalString.match(VARIABLE_NAME_REGEXP_ALL);
    if (variables !== null) {
      data = this.getVariablesFromUserData(variables);
    }
    return new Function(...data.keys, funcString)(...data.values);
  }

  private getVariablesFromUserData(variables: string[]): {keys: string[], values: any[]} {
    const userData = this.getInitialData();
    return variables.reduce((acc, key) => {
      if (userData[key]) {
        acc.keys.push(key);
        acc.values.push(userData[key].value);
      }
      return acc;
    }, {keys: [], values: []});
  }

  updateNodeExpressions() {
    if (this.data.expressions) {
      for (let exp in this.data.expressions) {
        this.data.expressions[exp].forEach(([node, expression]) => {
          node.data = this.eval(expression);
        });
      }
    }
  }
  run() {
    this.data = this.parseDom();
    this.updateNodeExpressions();
  }
}