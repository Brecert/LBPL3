import { LogicNode } from '../LogicNode.js';
import { Value } from '../Value.js';
export class ConnectionMerger extends LogicNode {
    constructor() {
        super();
        this.properties = {
            inputs: { type: 'int', default: 2, min: 2, max: 2 },
            outputs: { type: 'int', default: 1, min: 1, max: 1 },
        };
    }
    updateOutputs() {
        let a = this.inputs[0];
        let b = this.inputs[1];
        this.emitRaw(0, new Value(a.value, b.data, b.type));
    }
}
