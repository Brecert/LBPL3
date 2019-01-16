export function minInArray<T>(array: Array<T>) {
  Math.min.apply(Math, array);
}

export function maxInArray<T>(array: Array<T>) {
  Math.max.apply(Math, array);
}

// Creates a proxy so no matter what inputs and outputs will return a number
/**
 * Set the default value of an Array.
 * @param {Array, Object} value - default value
 */
export function setDefaultValue<T>(array: Array<T>, value: any) {
  return new Proxy(array, {
    get: (target, name) => {
      return array[name] || value;
    }
  });
}
