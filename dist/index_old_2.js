import { Emitter } from './src/logic/Emitter.js'

const canvas = document.createElement('canvas');
const app = document.getElementById('app')

canvas.setAttribute('width', '1000');
canvas.setAttribute('height', '1000');

app.appendChild(canvas)

const ctx = canvas.getContext('2d');

function calcCenter(number, distance, totalAmount, padding = 10) {
	padding /= 2

  let center = distance / (totalAmount + 1);
  center += padding
  center *= number + 1;
  center -= padding * (totalAmount - number)
  return center;
}

class RenderableObject extends Emitter {
	constructor() {
		super()
		this.pos = [0, 0]
	}

	get x() {
		return this.pos[0]
	}
	set x(value) {
		this.pos[0] = value
	}

	get y() {
		return this.pos[1]
	}
	set y(value) {
		this.pos[1] = value
	}

	draw() {}
}

class Chip extends RenderableObject {
	drawInputs() {
		let amount = 1
		let chip_size = 50
		let input_height = 15
		let input_width = 15

		for (let i = amount - 1; i >= 0; i--) {
			ctx.beginPath()
			ctx.fillStyle = '#7B7'
			ctx.rect(this.x - 7, calcCenter(i, chip_size, amount, input_height / 5) + (17.5 + chip_size / 2) + (input_height / 1.5) - input_height + 7.5, input_width, input_height / 1.5)
			ctx.closePath()
			ctx.fill()
		}
	}

	draw() {
		this.drawInputs()

		ctx.fillStyle = '#333'
		ctx.strokeStyle = '#FA0'
		ctx.lineWidth = 1.5
		ctx.beginPath()
		ctx.rect(this.x, this.y, 50, 50)
		ctx.closePath()
		
		ctx.addHitRegion({id: 'chip', cursor: 'grab'})

		ctx.fill()
		ctx.stroke()
	}
}

function synthEvent(name) {
	canvas.addEventListener(name, event => {
		if(node_list[event.region] !== undefined) {
			node_list[event.region].dispatchEvent(name, event)
			node_list.filter(v => v.id !== event.region).forEach(node => node.dispatchEvent(`!${name}`, event))
		} else {
			node_list.forEach(node => node.dispatchEvent(`!${name}`, event))
		}
	})
}

for(let name of ['mousedown', 'mousemove', 'mouseup']) {
	synthEvent(name)
}

// canvas.addEventListener('mousemove', event => {
// 	if(event.region === 'chip') {
// 		canvas.style.cursor = 'grab'
// 	} else {
// 		canvas.style.cursor = null
// 	}
// })

// canvas.addEventListener('mousedown', event => {
// 	if(event.region === 'chip') {
// 		canvas.style.cursor = 'grabbing'
// 	}
// })

let c = new Chip()
c.pos = [50, 50]
c.draw()
