import { Emitter } from './Emitter.js';
import { Value } from './Value.js';
import { setDefaultValue } from './util/Array.js';
export class LogicNode extends Emitter {
    constructor() {
        super();
        this.inputs = setDefaultValue([], new Value());
        this.outputs = setDefaultValue([], new Value());
        this.connections = [];
        this.properties = {
            inputs: { type: "number", default: 0, min: 0, max: 0 },
            outputs: { type: "number", default: 0, min: 0, max: 0 }
        };
        this.init();
    }
    defaultProperties() {
        for (let prop in this.properties) {
            this.properties[prop].value = this.properties[prop].default;
        }
    }
    init() {
        this.on('emit', (out) => {
            this.inputs[out.input] = out.raw;
            this.updateOutputs();
        });
    }
    postInit() {
        this.defaultProperties();
    }
    // emits a value
    // specifically it emits an output id and updates it
    emitRaw(id, value) {
        if (value !== undefined) {
            this.outputs[id] = value;
        }
        if (id !== undefined && this.connections.length > 0) {
            for (let connection of this.connections[id]) {
                this.chip
                    .findNode(connection.id)
                    .dispatchEvent('emit', {
                    id: id,
                    input: connection.input,
                    value: this.outputs[id].value,
                    data: this.outputs[id].data,
                    type: this.outputs[id].type,
                    raw: this.outputs[id]
                });
            }
        }
        else {
            // todo: implement dispatch all
        }
    }
    emit(id, value, data) {
        this.outputs[id] = Object.assign({}, this.inputs[id]);
        if (value !== undefined) {
            this.outputs[id].value = value;
        }
        if (data !== undefined) {
            this.outputs[id].data = data;
        }
        this.emitRaw(id);
    }
    emitValue(id, value) {
        this.emit(id, value);
    }
    emitData(id, data) {
        this.emit(id, this.inputs[id].value, data);
    }
    updateOutputs() { }
}
