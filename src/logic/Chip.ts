import { LogicNode } from './LogicNode.js'

export class Chip extends LogicNode {
  nodeList: LogicNode[];

  constructor() {
    super();
    this.nodeList = [];
  }

  findNode(node: number) {
    return this.nodeList[node];
  }

  add(node: LogicNode) {
  	node.id = this.nodeList.length
    node.chip = this
  	this.nodeList.push(node)
  }
}
