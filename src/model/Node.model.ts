import { NodeInterface } from "../interface/Node.interface";

export class NodeModel implements NodeInterface {
  constructor(public element: Node, public expression: string) {
      
  }
}