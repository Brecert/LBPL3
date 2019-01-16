import { LogicNode } from './LogicNode.js';
export class Chip extends LogicNode {
    constructor() {
        super();
        this.nodeList = [];
    }
    findNode(node) {
        return this.nodeList[node];
    }
    add(node) {
        node.id = this.nodeList.length;
        node.chip = this;
        this.nodeList.push(node);
    }
}
