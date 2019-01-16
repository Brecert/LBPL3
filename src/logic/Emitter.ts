export class Emitter {
  /**
   * The listeners of the node
   */
  _listeners: Map<any, any> = new Map();

  /**
   * Create a reciever
   */
  addEventListener(listener: any, cb: <U>(data: U) => void) {
    if (!(listener in this._listeners)) {
      this._listeners[listener] = [];
    }
    this._listeners[listener].push(cb);
  }
  // todo: fix typings
  on(listener: any, cb: <U>(data: any) => void) {
    this.addEventListener(listener, cb);
  }

  /**
   * Remove the reciever
   */
  removeEventListener(listener: any) {
    if (listener in this._listeners) {
      delete this._listeners[listener];
    }
  }

  /**
   * dispatch an event
   */
  dispatchEvent<T, U>(listener: any, data: U) {
    if (listener in this._listeners) {
      this._listeners[listener].forEach(cb => {
        cb(data);
      });
    }
  }
}
