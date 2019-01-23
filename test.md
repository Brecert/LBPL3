Automatically selects the outputs, inputs, and icon and fills them in, less need for code

sensor.svg
```html
<rect x="0" y="0">
	<g id="icon"></g>
	<g id="outputs"></g>
	<g id="inputs"></g>
</rect>
```

keypress.json
```json
{
	"chip": {
		"display": "sensor.svg",
		"name": "keypress sensor",
		"description": "activates when a key is pressed, and when applicable outputs the value of the keypress",
	}
}
```

kepress.js
```js
import { SensorNode } from '../SensorNode.js'
import { Value } from '../Value.js'

document.addEventListener('keydown', e => {
	LBPL.emit('keypress', e.code)	
}

export class Keypress extends SensorNode {
	constructor() {
		super()

		this.properties = {
			inputs:  { type: 'none', default: 0, max: 0, min: 0 },
			outputs: { type: 'int', default: 1, max: 1, min: 1 }
		}

		LBPL.on('keypress', e => this.emitData(e))
	}
}
```