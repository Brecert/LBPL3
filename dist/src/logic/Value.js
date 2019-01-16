import { NON } from './util/globals.js';
export class Value {
    constructor(value = NON, data = undefined, type = '@undefined') {
        this.value = value;
        this.data = data;
        this.type = type;
    }
}
