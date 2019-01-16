export class Emitter {
    constructor() {
        /**
         * The listeners of the node
         */
        this._listeners = new Map();
    }
    /**
     * Create a reciever
     */
    addEventListener(listener, cb) {
        if (!(listener in this._listeners)) {
            this._listeners[listener] = [];
        }
        this._listeners[listener].push(cb);
    }
    // todo: fix typings
    on(listener, cb) {
        this.addEventListener(listener, cb);
    }
    /**
     * Remove the reciever
     */
    removeEventListener(listener) {
        if (listener in this._listeners) {
            delete this._listeners[listener];
        }
    }
    /**
     * dispatch an event
     */
    dispatchEvent(listener, data) {
        if (listener in this._listeners) {
            this._listeners[listener].forEach(cb => {
                cb(data);
            });
        }
    }
}
