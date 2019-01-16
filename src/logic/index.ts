import { Not } from './nodes/not.js'
import { Print } from './nodes/print.js'
import { Reverse } from './nodes/reverse.js'
import { StringNode } from './nodes/string.js'

import { Chip } from './Chip.js'
import { LogicNode } from './LogicNode.js'

function connect(initial_node: LogicNode, output_id: number = 0) {
	return { to: (to_node: LogicNode, input_id: number = 0) => {
		if(initial_node.chip !== to_node.chip) {
			throw "Expected connecting chips to be on the same chip";
		}

		if(initial_node.connections[output_id] === undefined) {
			initial_node.connections[output_id] = []
		}

		initial_node.connections[output_id].push({ id: to_node.id, input: input_id })
	}}
}

function add(...initial_nodes: LogicNode[]) {
	return { to: (chip: Chip) => {
		for(let node of initial_nodes) {
			node.postInit()
			chip.add(node)
		}
	}}
}

let chip = new Chip()

let not = new Not()
let print = new Print()
let string = new StringNode()
let reverse = new Reverse()

let active = new Not()

add(not, print, string, reverse, active).to(chip)

connect(not).to(string)
connect(string).to(reverse)
connect(reverse).to(print, 1)
connect(active).to(print)

not.updateOutputs()
active.updateOutputs()