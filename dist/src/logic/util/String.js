export function reverse(string) {
    return Array.from(string.normalize()).reverse().join('');
}
