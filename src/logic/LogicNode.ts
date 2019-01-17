import { Emitter } from './Emitter.js'
import { IValue, Value } from './Value.js'
import { Chip } from './Chip.js'

import { setDefaultValue } from './util/Array.js'

import { IPropertyNumber } from './properties.js'


export interface IProperties {
  // Information about inputs
  inputs: IPropertyNumber;

  // Information about outputs
  outputs: IPropertyNumber;
}

/**
 * Connections work like this
 *
 * let outputs = {
 *  0: [],
 *  1: [{ id: 0, input: 2 }]
 * }
 *
 * The keys are the output, the value is an array
 * of connections that store the id of the chip it's connecting to, and the input it's connecting to [on that chip]
 */
interface IConnection {
	id: number
	input: number
}

interface IEmitData extends IValue {
  id: number
  input: number
  raw: IValue
}

export class LogicNode extends Emitter {
	id: number
  chip: Chip

	inputs: IValue[]
	outputs: IValue[]

	connections: Array<Array<IConnection>>

	properties: IProperties

	constructor() {
		super()

		this.inputs = setDefaultValue([], new Value())
		this.outputs = setDefaultValue([], new Value())

		this.connections = []

		this.properties = {
			inputs:  { type: "number", default: 0, min: 0, max: 0 },
			outputs: { type: "number", default: 0, min: 0, max: 0 }
		}

    this.init()
	}

  defaultProperties() {
    for(let prop in this.properties) {
      this.properties[prop].value = this.properties[prop].default
    }
  }

  init() {
    this.on('emit', (out: IEmitData) => {
      this.inputs[out.input] = out.raw
      this.updateOutputs()
    })
  }

  postInit() {
    this.defaultProperties()
  }

  // emits a value
  // specifically it emits an output id and updates it
  emitRaw(id?: number, value?: IValue) {
    if (value !== undefined) {
      this.outputs[id] = value;
    }

    if (id !== undefined && this.connections.length > 0) {
      for(let connection of this.connections[id]) {
        this.chip
            .findNode(connection.id)
            .dispatchEvent('emit', { 
              id: id, 
              input: connection.input,
              value: this.outputs[id].value,
              data: this.outputs[id].data,
              type: this.outputs[id].type,
              raw: this.outputs[id]
            })
      }
    } else {
      // todo: implement dispatch all
    }
  }

  emit<I, V, T>(id: number, value?: number, data?: T) {
  	this.outputs[id] = Object.assign({}, this.inputs[id])
  	
  	if (value !== undefined) {
  		this.outputs[id].value = value
  	}

  	if (data !== undefined) {
  		this.outputs[id].data = data
  	}

  	this.emitRaw(id)
  }

  emitValue(id: number, value: number) {
  	this.emit(id, value)
  }

  emitData<I, T>(id: number, data: T) {
  	this.emit(id, this.inputs[id].value, data)
  }

  updateOutputs() {}
}