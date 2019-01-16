import { NON } from './util/globals.js'


export interface IValue {
  /**
   * the data of the input
   * eg. "Hello World"
   * only used for certain inputs
   */
  data?: any;

  // The value of the input/output
  // usually -100..100
  value: number;

  // the type of the input/output
  // eg. "string"
  // it's used to do checking when updating the node
  type: string;
}

export class Value implements IValue {
  constructor(public value = NON, public data = undefined, public type = '@undefined') {}
}