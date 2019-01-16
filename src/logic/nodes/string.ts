import { LogicNode, IProperties } from '../LogicNode.js'
import { IPropertyString } from '../properties.js'

export interface IStringNodeProperties extends IProperties {
  string: IPropertyString
}

export class StringNode extends LogicNode {
  properties: IStringNodeProperties

  // inputs[0] : if above 0 then string will be emitted along with current value

  constructor() {
    super();

    this.properties = {
      inputs:  { type: 'int', default: 1, min: 1, max: 1 },
      outputs: { type: 'int', default: 1, min: 1, max: 1 },
      string: { type: 'string', default: "I'm a string ^w^" }
    };
  }

  updateOutputs() {
    if(this.inputs[0].value > 0) {
      this.emitData(0, this.properties.string)
    }
  }
}
