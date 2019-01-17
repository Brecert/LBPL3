import './drag.js'

import { Chip } from './src/logic/Chip.js';
import { Not } from './src/logic/nodes/not.js';
import { Print } from './src/logic/nodes/print.js';
import { Reverse } from './src/logic/nodes/reverse.js';
import { StringNode } from './src/logic/nodes/string.js';
import { LogicNode } from './src/logic/LogicNode.js'

// dynamic "static" methods...
const LeafMouse = function(target = window) {
	let event = {}

	let moveHandler = (e) => {
		event = e
	}

	target.addEventListener('mousemove', moveHandler)

	Object.defineProperties(LeafMouse, {
		x: {
			get() { return event.x }
		},
		y: {
			get() { return event.y }
		},
		px: {
			get() { return event.pageX }
		},
		py: {
			get() { return event.pageY }
		},
		sx: {
			get() { return event.screenX }
		},
		sy: {
			get() { return event.screenY }
		}
	})
}
LeafMouse()

// logic
function connect(initial_node, output_id = 0) {
    return { to: (to_node, input_id = 0) => {
            if (initial_node.chip !== to_node.chip) {
                throw "Expected connecting chips to be on the same chip";
            }
            if (initial_node.connections[output_id] === undefined) {
                initial_node.connections[output_id] = [];
            }

            initial_node.connections[output_id].push({ id: to_node.id, input: input_id });
        } };
}

function add(...initial_nodes) {
    return { to: (chip) => {
            for (let node of initial_nodes) {
                node.postInit();
                chip.add(node);
            }
        } };
}

let chip = new Chip();
let not = new Not();
let print = new Print();
let string = new StringNode();
let reverse = new Reverse();
let active = new Not();

add(not, print, string, reverse, active).to(chip);
connect(not).to(string);
connect(string).to(reverse);
connect(reverse).to(print, 1);
connect(active).to(print);

// rendering
let svg = SVG('#svg')
let lines = svg.group()

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

function calcCenter(number, distance, totalAmount, padding = 10) {
	padding /= 2

  let center = distance / (totalAmount + 1);
  center += padding
  center *= number + 1;
  center -= padding * (totalAmount - number)
  return center;
}

function renderWire(x1, y1, x2, y2, value = 0, rotation = 0) {

	let gradient = ctx.createLinearGradient(x1, y1, x2, y2);

	let color = {from: '#455', to: '#544'}

	if(value > 0) {
		color.from = '#5c4'
		color.to = '#6c7'

		// color.from.at(output.value / 100)
		// color.to.at(output.value / 100)
	} 
	else if (value < 0) {
		color.from = '#c45'
		color.to = '#c76'
	}

	// gradient.addColorStop(Math.abs(Math.cos((rotation / 1100) + 0)), '#f33')
	gradient.addColorStop(0, color.from)
	gradient.addColorStop(1, color.to)
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	ctx.closePath()

	ctx.globalAlpha = 0.95;

	ctx.setLineDash([])
	ctx.strokeStyle = gradient
	ctx.lineWidth = 7
	ctx.stroke()

	ctx.globalAlpha = 0.7;

	ctx.setLineDash([5])
	ctx.lineDashOffset = (rotation / (100 - 0 /* output.value */))
	ctx.strokeStyle = '#7e7'
	ctx.lineWidth = 2.5
	ctx.stroke()
}

function renderAllConnections(rotation) {
	ctx.clearRect(0, 0, 1000, 1000)
	for(let node of chip.nodeList) {
		node.displayConnections(rotation)
	}
}

function renderConnectingTo() {

	let node = global.connecting.node
	let output = node.display.outputs[global.connecting.output]
	let output_pos = {x: output.rbox(svg).x2, y: output.rbox(svg).cy}

	let {x, y} = svg.point(LeafMouse.px, LeafMouse.py)

	// console.log(output_pos.x, output_pos.y, LeafMouse.px, LeafMouse.py)

	renderWire(output_pos.x, output_pos.y, x, y)
}

let start = null
let last_t = 0
function animationLoop(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;

  let t0 = performance.now();

  if(last_t > 25) {
  	  if(progress > last_t * 10000) {
	  	start = timestamp
			renderAllConnections(timestamp);
 		}
  } else {
  	renderAllConnections(timestamp)
  }

  if(global.connecting.active) {
  	renderConnectingTo()
  }

  // if(global.connecting.active && !global.connecting.listening) {
  // 	global.connecting.listening = true

  // 	SVG.on(window, 'mousemove', renderConnectingTo)
  // }

  // if(!global.connecting.active && global.connecting.listening) {
  // 	global.connecting.listening = false

  // 	SVG.off(window, 'mousemove', renderConnectingTo)
  // }

 	let t1 = performance.now();

 	// ctx.textAlign = 'left'
 	// ctx.textBaseline = 'top'
 	// ctx.fillStyle = 'white'
 	// ctx.font = '48px serif';
 	// ctx.fillText(`${last_t}ms ${progress}`, 15, 15)

 	last_t = t1 - t0

  window.requestAnimationFrame(animationLoop);
}
// temp
function calcAngleDegrees(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

const global = {
	connecting: {
		active: false,
		listening: false,
		node: 0,
		output: 0
	}
}

const VisualChip = {
	display: {
		chip: undefined,
		inputs: [],
		outputs: []
	},

	createOutputs(chip = this.display.chip) {
		let output_amount = this.properties.outputs.value
		for (let i = output_amount - 1; i >= 0; i--) {
			let y_offset = calcCenter(i, 0, output_amount, chip.height() / output_amount)
			let output = chip.polygon('0, 0 0, 50 50, 50').y(y_offset).x(32).rotate(45).scale(0.6, 0.3).addClass('output')

			output.on('click', event => {
				global.connecting = {
					active: true,
					node: this,
					output: i
				}
			})

			this.display.outputs[i] = output
		}	
	},

	createInputs(chip = this.display.chip) {
		let input_amount = this.properties.inputs.value
		for (let i = input_amount - 1; i >= 0; i--) {
			let y_offset = calcCenter(i, 44, input_amount, chip.height() / input_amount)
			let input = chip.rect(25, 15).x(-5).y( y_offset - (15 / 4) ).addClass('input')

			input.on('click', event => {
				if(global.connecting.active) {
					connect(global.connecting.node).to(this)

					global.connecting.active = false
				}
			})

			input.on('mouseover', event => {
				input.addClass('hover')

			})

			input.on('mouseout', event => {
				input.removeClass('hover')
			})

			this.display.inputs[i] = input
		}
	},

	createMicrochip(chip = this.display.chip) {
		let microchip = chip.rect(50, 50).addClass('microchip')
	},

	displayConnections(rotation = 0, chip = this.display.chip) {
		ctx.save()
		for (let output_id in this.connections) {
			let output = this.outputs[output_id]

			for (let connection of this.connections[output_id]) {
				let connecting_chip = this.chip.findNode(connection.id)

				let output_pos = {x: this.display.outputs[output_id].rbox(svg).x2, y: this.display.outputs[output_id].rbox(svg).cy}
				let input_pos = {x: connecting_chip.display.inputs[connection.input].rbox(svg).x, y: connecting_chip.display.inputs[connection.input].rbox(svg).cy}
				let center_pos = {x: output_pos.x + (input_pos.x - output_pos.x) / 2, y: output_pos.y + (input_pos.y - output_pos.y) / 2}

				renderWire(output_pos.x, output_pos.y, input_pos.x, input_pos.y, output.value, rotation)

				// draw output value
				ctx.save()
				ctx.translate(center_pos.x, center_pos.y)
				ctx.rotate(calcAngleDegrees(input_pos.x - output_pos.x, input_pos.y - output_pos.y) * Math.PI / 180)
				ctx.fillStyle = 'white'
				ctx.textBaseline = 'middle'
				ctx.textAlign = 'center'
				ctx.fillText(output.value, 0, -7)
				ctx.restore()
			}
		}
		ctx.restore()
	},

	createVisuals() {
		this.display = {
			chip: svg.group().translate(50, 50).translate(Math.random() * 750, Math.random() * 750).addClass('chip'),
			inputs: [],
			outputs: [],

			info: undefined
		}

		for(var key in this.properties) {
			let property = this.properties[key]

			this.properties[key] = new Proxy(property, {
				set: (obj, prop, value) => {
					obj[prop] = value

					this.updateVisuals()

					return true
				}
			})
		}

		let chip = this.display.chip
		chip.text(`${this.id.toString()}. ${this.constructor.name}`).y(-25)

		chip.on('mouseover', event => {
			chip.addClass('hover')
		})

		chip.on('mouseout', event => {
			chip.removeClass('hover')
		})

		this.createOutputs()
		this.createInputs()

		this.createMicrochip()

		let info = chip.group().translate(0, 50)
		info.text(add => {
			for(let prop of Object.entries(this.properties).filter(prop => prop[0] !== 'inputs' && prop[0] != 'outputs')) {
				add.tspan(`${prop[0]}: ${prop[1].value}`).newLine().dx(10)
			}
		})
		this.display.info = info

		chip.draggable( (e, x, y) => {
			let grid_scale = 25

			// e.transform({
			// 	position: [Math.ceil(x / grid_scale) * grid_scale, Math.ceil(y / grid_scale) * grid_scale]
			// })
		})
	},

	updateVisuals() {
		this.updateInfo()
	},

	updateInfo() {
		let info = this.display.chip.group().translate(0, 50)

		info.text(add => {
			for(let prop of Object.entries(this.properties).filter(prop => prop[0] !== 'inputs' && prop[0] != 'outputs')) {
				// console.log(this.id, 'info', prop, this.properties)
				add.tspan(`${prop[0]}: ${prop[1].value}`).newLine().dx(10)
			}
		})

		this.display.info.remove()
		this.display.info = info
	}
}
Object.assign(LogicNode.prototype, VisualChip)

for(let node of chip.nodeList) {
	node.createVisuals()
}

for(let node of chip.nodeList) {
	node.displayConnections()
}

// stuff

window.requestAnimationFrame(animationLoop)

let start_button = document.getElementById('start')
start_button.addEventListener('click', event => {
	for(let node of chip.nodeList) {
		if(!(node.inputs.length > 0)) {
			node.updateOutputs()
		}
	}
})

let add_button = document.getElementById('add')
add_button.addEventListener('click', event => {
	let node = new Not()
	add(node).to(chip)
	node.createVisuals()
	node.displayConnections()

	// connect(node).to(chip.nodeList[1])
})
