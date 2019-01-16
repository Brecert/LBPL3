import { LogicNode, IProperties } from '../LogicNode.js'
import { IPropertyString } from '../properties.js'
import { Value } from '../Value.js'

export interface IConnectionMergerProperties extends IProperties {}

export class ConnectionMerger extends LogicNode {
  properties: IConnectionMergerProperties

  constructor() {
    super();

    this.properties = {
      inputs:  { type: 'int', default: 2, min: 2, max: 2 },
      outputs: { type: 'int', default: 1, min: 1, max: 1 },
    };
  }

  updateOutputs() {
    let a = this.inputs[0]
    let b = this.inputs[1]

    this.emitRaw(0, new Value(a.value, b.data, b.type))
  }
}
