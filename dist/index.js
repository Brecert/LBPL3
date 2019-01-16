import './drag.js'

import { Chip } from './src/logic/Chip.js';
import { Not } from './src/logic/nodes/not.js';
import { Print } from './src/logic/nodes/print.js';
import { Reverse } from './src/logic/nodes/reverse.js';
import { StringNode } from './src/logic/nodes/string.js';
import { LogicNode } from './src/logic/LogicNode.js'

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

function renderAllConnections(rotation) {
	ctx.clearRect(0, 0, 1000, 1000)
	for(let node of chip.nodeList) {
		node.displayConnections(rotation)
	}
}

let start = null
function animationLoop(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;

	renderAllConnections(timestamp)

  window.requestAnimationFrame(animationLoop);
}
// temp
function calcAngleDegrees(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
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

			this.display.outputs[i] = output
		}	
	},

	createInputs(chip = this.display.chip) {
		let input_amount = this.properties.inputs.value
		for (let i = input_amount - 1; i >= 0; i--) {
			let y_offset = calcCenter(i, 44, input_amount, chip.height() / input_amount)
			let input = chip.rect(25, 15).x(-5).y( y_offset - (15 / 4) ).addClass('input')

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
				// console.log(this.id, output_id, connection, this.chip.findNode(connection.id).display)
				let connecting_chip = this.chip.findNode(connection.id)
				// let wire = lines.line(chip.rbox().x, chip.rbox.x, connecting_chip.rbox().cx, connecting_chip.rbox().cy).stroke({ color: '#f06', width: 10, linecap: 'round' })
				// let wire = lines.line(
				// 		chip.rbox(svg).cx,
				// 		chip.rbox(canvas).cy,
				// 		connecting_chip.rbox(svg).cx,
				// 		connecting_chip.rbox(svg).cy
				// ).stroke({ color: '#f06', width: 10, linecap: 'round' })

				// ctx.clearRect(0, 0, 1000, 1000)
				const gradient = ctx.createLinearGradient(
					this.display.outputs[output_id].rbox(svg).x2,
					this.display.outputs[output_id].rbox(svg).y2,
					connecting_chip.display.inputs[connection.input].rbox(svg).cx,
					connecting_chip.display.inputs[connection.input].rbox(svg).cy
				);

				let color = '#455'
				let color2 = '#544'

				if(output.value > 0) {
					color = '#5c4'
					color2 = '#6c7'
				} 
				else if (output.value < 0) {

				}

				let output_pos = {x: this.display.outputs[output_id].rbox(svg).x2, y: this.display.outputs[output_id].rbox(svg).cy}
				let input_pos = {x: connecting_chip.display.inputs[connection.input].rbox(svg).x, y: connecting_chip.display.inputs[connection.input].rbox(svg).cy}
				let center_pos = {x: output_pos.x + (input_pos.x - output_pos.x) / 2, y: output_pos.y + (input_pos.y - output_pos.y) / 2}

				// gradient.addColorStop(Math.abs(Math.cos((rotation / 1100) + 0)), '#f33')
				gradient.addColorStop(0, color)
				gradient.addColorStop(1, color2)
				ctx.beginPath()
				ctx.moveTo(output_pos.x, output_pos.y)
				ctx.lineTo(input_pos.x, input_pos.y)
				ctx.closePath()

				ctx.globalAlpha = 0.95;

				ctx.setLineDash([])
				ctx.strokeStyle = gradient
				ctx.lineWidth = 7
				ctx.stroke()

				ctx.globalAlpha = 0.7;

				ctx.setLineDash([5])
				ctx.lineDashOffset = (rotation / (100 - output.value))
				ctx.strokeStyle = '#7e7'
				ctx.lineWidth = 2.5
				ctx.stroke()

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