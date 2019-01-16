import './drag.js'

let canvas = SVG('#canvas')

console.log(canvas)

let chip = canvas.group().translate(50, 50).addClass('chip')
let output = chip.polygon('0, 0 0, 50 50, 50').x(32).rotate(45).scale(0.6, 0.3).addClass('output')
let input = chip.rect(25, 15).x(-5).y( (50 / 2) - ( 15 / 2 ) ).addClass('input')
let microchip = chip.rect(50, 50).addClass('microchip')


let making_connection = {on: false}

output.on('mousedown', function(event) {
	console.log(this)

	// making_connection = { on: true, x: sx, y: sy }
})

microchip.on('mousedown', function(event) {
	this.addClass('focus')
})

SVG.on(window, 'mousemove', function(event) {
	if(making_connection.on) {
		console.log(making_connection)

		let {x, y} = canvas.point(event.pageX, event.pageY)

		canvas.line(making_connection.x, making_connection.y, x, y).stroke('#fff').fill('#333')
	}
})

SVG.on(window, 'mouseup', function(event) {
	microchip.removeClass('focus')
})

chip.draggable(function(e, x, y) {

	let grid_scale = 25

	e.transform({
		position: [Math.ceil(x / grid_scale) * grid_scale, Math.ceil(y / grid_scale) * grid_scale]
	})
})


// let ins = []
// let outs = []
// for(let node of chip.nodeList) {

// 	ins[node.id] = []
// 	outs[node.id] = []

// 	let chip = canvas.group().translate(50, 50).addClass('chip')
// 	chip.text(`${node.id.toString()}. ${node.constructor.name}`).y(-25)

// 	let output_amount = node.properties.outputs.value
// 	for (let i = output_amount - 1; i >= 0; i--) {
// 		let y_offset = calcCenter(i, 0, output_amount, chip.height() / output_amount)
// 		let output = chip.polygon('0, 0 0, 50 50, 50').y(y_offset).x(32).rotate(45).scale(0.6, 0.3).addClass('output')

// 		outs[node.id][i] = output
// 	}

// 	let input_amount = node.properties.inputs.value
// 	for (let i = input_amount - 1; i >= 0; i--) {
// 		let y_offset = calcCenter(i, 44, input_amount, chip.height() / input_amount)
// 		let input = chip.rect(25, 15).x(-5).y( y_offset - (15 / 4) ).addClass('input')

// 		ins[node.id][i] = input
// 	}

// 	let microchip = chip.rect(50, 50).addClass('microchip')

// 	chip.draggable( function(e, x, y) {
// 		let grid_scale = 25

// 		e.transform({
// 			position: [Math.ceil(x / grid_scale) * grid_scale, Math.ceil(y / grid_scale) * grid_scale]
// 		})
// 	})
// }

// for(let node of chip.nodeList) {
// 	console.log(node.id, ins)
// 	for (let output_id in node.connections) {
// 		for(let connection of node.connections[output_id]) {
// 			console.log(node.id, output_id, outs[output_id])
// 			console.log(node.id, connection.id)
// 			let wire = chip.line(outs[node.id][output_id].cx(), outs[node.id][output_id].cy(), ins[connection.id][connection.input].cx(), ins[connection.id][connection.input].cy()).stroke({ color: '#f06', width: 10, linecap: 'round' })
// 		}
// 	}
// }