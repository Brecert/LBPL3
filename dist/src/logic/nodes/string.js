import { LogicNode } from '../LogicNode.js';
export class StringNode extends LogicNode {
    // inputs[0] : if above 0 then string will be emitted along with current value
    constructor() {
        super();
        this.properties = {
            inputs: { type: 'int', default: 1, min: 1, max: 1 },
            outputs: { type: 'int', default: 1, min: 1, max: 1 },
            string: { type: 'string', default: "I'm a string ^w^" }
        };
    }
    updateOutputs() {
        if (this.inputs[0].value > 0) {
            this.emitData(0, this.properties.string);
        }
    }
}
