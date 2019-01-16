import { LogicNode, IProperties } from '../LogicNode.js'
import { IPropertyString } from '../properties.js'
import { reverse as reverseString } from '../util/String.js'

export interface IReverseProperties extends IProperties {
  type: IPropertyString
}

export class Reverse extends LogicNode {
  properties: IReverseProperties

  constructor() {
    super();

    this.properties = {
      inputs:  { type: 'int', default: 1, min: 1, max: 1 },
      outputs: { type: 'int', default: 1, min: 1, max: 1 },
      type: { type: 'string', default: 'string' }
    };
  }

  updateOutputs() {
    if (this.properties.type.value === 'string') {
      this.emitData(0, reverseString(this.inputs[0].data.value))
    }
  }
}
