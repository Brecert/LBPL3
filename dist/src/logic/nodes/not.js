import { LogicNode } from '../LogicNode.js';
export class Not extends LogicNode {
    constructor() {
        super();
        this.properties = {
            inputs: { type: 'int', default: 1, max: 1, min: 1 },
            outputs: { type: 'int', default: 1, max: 1, min: 1 }
        };
    }
    updateOutputs() {
        if (this.inputs[0].value === 0) {
            this.emit(0, 100);
        }
        else {
            this.emit(0, -this.inputs[0].value);
        }
    }
}
