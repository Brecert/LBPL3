export function reverse(string: string) {
	return Array.from(string.normalize()).reverse().join('')
}