export interface IProperty<T> {
	value?: T

	default: T
	type: string
}

export interface IPropertyString extends IProperty<string> {
	default: string
	type: "string"
}

export interface IPropertyNumber extends IProperty<number> {
	type: "number" | "int" | "float"
	
	min: number
	max: number
}