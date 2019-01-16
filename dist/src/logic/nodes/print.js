import { LogicNode } from '../LogicNode.js';
export class Print extends LogicNode {
    // input[0] : activate
    // input[1] : set message with data
    constructor() {
        super();
        this.properties = {
            inputs: { type: 'int', default: 2, min: 2, max: 2 },
            outputs: { type: 'int', default: 0, min: 0, max: 0 },
            message: { type: 'string', default: "Hello World!" }
        };
    }
    updateOutputs() {
        if (this.inputs[1].value > 0) {
            this.properties.message.value = this.inputs[1].data;
        }
        if (this.inputs[0].value > 0) {
            console.log(this.properties.message.value);
        }
    }
}
