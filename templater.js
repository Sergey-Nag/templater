const NODE_TYPE_ELEMENT = 1;
const NODE_TYPE_TEXT = 3;

class Templater {
  #data = {};
  #nodes = [];
  constructor({ el, data }) {
    this.el = el;
    this.data = data;
    this.parentElement = document.querySelector(el);
    this.#nodes = new Map();
  }

  #collectVariables(element = this.parentElement) {
    const childNodes = [...element.childNodes];
    childNodes.forEach((node) => {
      if (node.nodeType === NODE_TYPE_TEXT) {
        const matches = node.nodeValue.matchAll(/{{\s*(\w+)\s*}}/g);
        if (!matches) return;

        for (let match of matches) {
          const variable = match[1];
          const startAt = match.index;
          if (Object.keys(this.data).includes(variable)) {
            const newNode = [node, variable, match[0], startAt];
            if (this.#data[variable]) {
              this.#data[variable].views.nodes.push(newNode);
            } else {
              this.#data[variable] = {
                name: variable,
                value: this.data[variable],
                views: {
                  nodes: [newNode],
                },
              };
            }
            this.#nodes.set(node, this.#nodes.has(node) ? [...this.#nodes.get(node), newNode] : [newNode]);
          }
        };
      } else if (node.nodeType === NODE_TYPE_ELEMENT) {
        this.#collectVariables(node);
      }
    }); 
  }

  #updateVariableView(variable) {
    const { value } = this.#data[variable];
    this.#data[variable].views.nodes = this.#data[variable].views.nodes.map(([node, prevValue, startAt]) => {
      console.log(node, prevValue, startAt);
      const newValue = value.toString();
      const prevLength = prevValue.toString().length;
      const beforeValueString = node.data.substring(0, startAt);
      const afterValueString = node.data.substring(startAt + prevLength);
      node.data = beforeValueString + newValue + afterValueString;

      // If the current node has multiple values, find the next positions and subtract the position differences
      const currentLineNode = this.#nodes.get(node);
      let nextIndex = startAt;
      if (currentLineNode && currentLineNode.length > 1) {
        currentLineNode.forEach((key, i) => {
          const nextNodeIndex = this.#data[key].views.nodes.findIndex(([n, v, s]) => n === node && s > nextIndex);
          // const sameNodeWithAnotherValueIndex = this.#data[key].views.nodes.findIndex(([n]) => n === node);
          if (nextNodeIndex === -1) return;
          // if (sameNode[2] < (startAt + value.toString().length)) return;
          nextIndex = this.#data[key].views.nodes[nextNodeIndex][2] = this.#data[key].views.nodes[nextNodeIndex][2] - (prevLength - newValue.length);
        });
      }

      return [node, value, startAt];
    });
  }

  #updateView(_node, nodeDatasArr) {
    let valueCurrentNode = {};
    if (_node instanceof Text) {
      valueCurrentNode = Object.keys(this.#data).reduce((res, variable) => {
        if (this.#data[variable].views.nodes.some(([n]) => n === _node))
          res[variable] = this.#data[variable].value;
        return res;
      }, {});
    } else {
      // _node -> variable
      valueCurrentNode[_node] = this.#data[_node].value;
      nodeDatasArr = this.#data[_node].views.nodes;
    }

    console.log(nodeDatasArr);
    nodeDatasArr.forEach((nodeData, i) => {
      const [node, variable, prevValue, startAt] = nodeData;
      const newValue = valueCurrentNode[variable].toString();
      const prevLength = prevValue.toString().length;
      const beforeValueString = node.data.substring(0, startAt);
      const afterValueString = node.data.substring(startAt + prevLength);
      
      node.data = beforeValueString + newValue + afterValueString;
      const arrToUpdateIndices = _node instanceof Text ? nodeDatasArr : this.#nodes.get(node);
    
      this.#updateIndices(arrToUpdateIndices, (prevLength - newValue.length), i);

      nodeDatasArr[i] = [node, variable, newValue, startAt];
    });
  }

  #updateIndices(nodeDatasArr, differences, fromIndex) {
    nodeDatasArr.forEach((data, index) => {
      if (index <= fromIndex) return;

      nodeDatasArr[index][3] = nodeDatasArr[index][3] - differences;
    });
  }

  #updateVariableViews(variable) {
    if (variable === undefined) {
      for (let entry of this.#nodes) {
        this.#updateView(...entry);
      };
    } else {
      this.#updateView(variable);
    }
  }

  #setSetters() {
    for (let variable in this.data) {
      Object.defineProperty(this.data, variable, {
        get: () => this.#data[variable].value,
        set: (value) => {
          if (this.#data[variable].value !== value) {
            this.#data[variable].value = value;
            this.#updateVariableViews(variable);
          }
        }
      });
    }
  }
  
  firstRender() {
    this.#collectVariables();
    this.#setSetters();
    this.#updateVariableViews();
    console.log(this.#data);
    console.log(this.#nodes);
  }
}