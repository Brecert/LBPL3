// if (module.hot) {
// 	module.hot.dispose(() => {
// 		window.location.reload();
// 	})
// }

import { Emitter } from './src/logic/Emitter.js'

const canvas = document.createElement('canvas');
const app = document.getElementById('app')

canvas.setAttribute('width', '1000');
canvas.setAttribute('height', '1000');

app.appendChild(canvas)

const ctx = canvas.getContext('2d');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Ticker {
	constructor(tickrate = 1000) {
		this.tickrate = tickrate
		this.tick = 0
		this.listeners = []
		this.loop = async function() {
			while(true) {
				console.log(this)
				this.tick += 1
	      this.listeners.forEach(cb => {
  	      cb(this.tick);
      	});
				await sleep(this.tickrate);
			}
		}
		this.loop()
	}

	async onTick(cb) {
    this.listeners.push(cb)
	}
}

let node_list = []
const idGenerator = function*() {
	let last_id = 0
	while(true) {
		yield last_id += 1
	}
}()

function generate_id() {
	return idGenerator.next().value
}


// ctx.scale(canvas.width / 100, canvas.height / 100)

class RenderableObject extends Emitter {
	constructor() {
		super()

		this.id = generate_id()
		node_list[this.id] = this

		this.pos = [0, 0]
		this.rotation = 0
		this.scale = [1, 1]

		this.draggable = false

		this.style = {
			default: {
				fill: '#fff',
				border: '#000'
			},
			hovered: {},
			focused: {},
			dragging: {
				opacity: 0.75
			}
		}

		this.state = {
			default: true,
			hovered: false,
			focused: false,

			dragging: false
		}

		this.auto = {
			all: true,
			position: true,
			rotation: true,
			scale: true
		}

		let offset = {x: 0, y: 0}

		this.on('mousedown', event => {
			this.state.focused = true

			if(this.draggable) {
				this.state.dragging = true

				let rect = canvas.getBoundingClientRect();
		    let x = (event.clientX - rect.left) * (canvas.width / rect.width)
    		let y = (event.clientY - rect.top) * (canvas.height / rect.height);

    		offset = {x: this.x - x, y: this.y - y}

				this.x = x + offset.x
				this.y = y + offset.y
			}

			this.draw()
		})

		canvas.addEventListener('mouseup', event => {
			this.state.focused = false

			if(this.draggable) {
				this.state.dragging = false
			}

			this.draw()
		})

		this.on('mousemove', event => {
			this.state.hovered = true

			this.draw()
		})

		canvas.addEventListener('mousemove', event => {
			if(this.state.dragging) {
				let rect = canvas.getBoundingClientRect();
		    let x = (event.clientX - rect.left) * (canvas.width / rect.width)
    		let y = (event.clientY - rect.top) * (canvas.height / rect.height);

				this.x = x + offset.x
				this.y = y + offset.y
			}
		})

		this.on('!mousemove', e => {
			this.state.hovered = false
			this.draw()
		})
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

	draw() {
		this.preDraw()
		this.drawSelf()
		this.postDraw()
	}

	preDraw() {
		ctx.save()

		if(this.pos != undefined) {
			ctx.translate(this.x, this.y)
		}

		if(this.rotation != undefined && this.rotation != 0) {
			ctx.rotate(this.rotation)
		}

		if(this.scale != undefined && this.scale != [1, 1]) {
			ctx.scale(this.scale.x, this.scale.y)
		}
	}
	drawSelf() {}
	postDraw() {
		ctx.restore()
		ctx.addHitRegion({id: this.id});
	}
}

// class Polygon extends RenderableObject {
// 	constructor(sides = 3, radius = 32) {
// 		super()

// 		this.sides = sides
// 		this.radius = radius
// 	}

// 	drawSelf() {
// 		ctx.beginPath()

// 		if(this.state.hovered) {
// 			ctx.fillStyle = this.style.hovered.fill
// 		}

// 		if(this.state.focused) {
// 			ctx.fillStyle = this.style.focused.fill
// 		}

// 		for (let i = this.sides - 1; i >= 0; i--) {
// 			ctx.rotate(2 * Math.PI / this.sides)
// 			ctx.lineTo(this.radius, 0)
// 		}

// 		ctx.closePath()
// 	}
// }

class Input extends RenderableObject {

}

class Node extends RenderableObject {
	constructor() {
		super()

		this.draggable = true

		this.inputs = ['a']

		this.style = {
			default: {
				fill: '#495'
			},
			hovered: {
				fill: '#374'
			},
			focused: {
				fill: '#222'
			}
		}
	}

	drawSelf() {
		ctx.fillStyle = this.style.default.fill

		if(this.state.hovered) {
			ctx.fillStyle = this.style.hovered.fill
		}

		if(this.state.focused) {
			ctx.fillStyle = this.style.focused.fill
		}

		this.inputs.forEach(input => {

			// input.style.hovered.fill = '#333'
			// input.y = 50

			// input.draw()
			// ctx.fill()

			ctx.beginPath()
			ctx.rect(-10, 37.5, 25, 25)
			ctx.fill()
			ctx.closePath()
		})


		ctx.beginPath()
		ctx.rect(0, 0, 100, 100)
		ctx.closePath()

		ctx.strokeStyle = '#fff'
		ctx.fill()
		ctx.stroke()
		ctx.addHitRegion({id: this.id})
	}
}

function synthEvent(name) {
	canvas.addEventListener(name, event => {

		console.log(name, event.region)

		if(node_list[event.region] !== undefined) {
			node_list[event.region].dispatchEvent(name, event)
			node_list.filter(v => v.id != event.region).forEach(node => node.dispatchEvent(`!${name}`, event))
		} else {
			node_list.forEach(node => node.dispatchEvent(`!${name}`, event))
		}
	})
}

// canvas.addEventListener('mousedown', event => {
//     var rect = canvas.getBoundingClientRect();
//     console.log(rect, event)
//     // (108 - 103) * 0.618
//     var x = (event.clientX - rect.left) * (canvas.width / rect.width)
//     var y = (event.clientY - rect.top) * (canvas.height / rect.height);
//     console.log("x: " + x + " y: " + y);
// })

for(let name of ['mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup']) {
	synthEvent(name)
}

let x = new Node
x.pos[0] += 25
x.pos[1] += 25
x.draw()