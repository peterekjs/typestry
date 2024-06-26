import type { AnyFunction } from 'ts-essentials'
import type { TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { getType } from '../helpers'

const $function: TypeIdentifier<AnyFunction> = createIdentifier(
  describeType('function', (v): v is AnyFunction => typeof v === 'function')
)
const $class: TypeIdentifier<new () => object> = createIdentifier(
  describeType('class', (v): v is new () => object => getType(v) === 'class')
)
const $AnyFunction: TypeIdentifier<AnyFunction> = createIdentifier(
  describeType('AnyFunction', (v): v is AnyFunction => typeof v === 'function')
)
const $Function: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType('Function', (v): v is Generator<any> => getType(v) === 'Function')
)
const $AsyncFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType('AsyncFunction', (v): v is Generator<any> => getType(v) === 'AsyncFunction')
)
const $GeneratorFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType('GeneratorFunction', (v): v is Generator<any> => getType(v) === 'GeneratorFunction')
)
const $AsyncGeneratorFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType('AsyncGeneratorFunction', (v): v is Generator<any> => getType(v) === 'AsyncGeneratorFunction')
)

export { $class, $function, $AnyFunction, $Function, $AsyncFunction, $GeneratorFunction, $AsyncGeneratorFunction }
