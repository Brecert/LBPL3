export function minInArray(array) {
    Math.min.apply(Math, array);
}
export function maxInArray(array) {
    Math.max.apply(Math, array);
}
// Creates a proxy so no matter what inputs and outputs will return a number
/**
 * Set the default value of an Array.
 * @param {Array, Object} value - default value
 */
export function setDefaultValue(array, value) {
    return new Proxy(array, {
        get: (target, name) => {
            return array[name] || value;
        }
    });
}
