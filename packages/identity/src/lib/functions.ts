import type { AnyFunction } from 'ts-essentials'
import type { TypeIdentifier } from '../definitions'
import { describeType } from '../describe'
import { createIdentifier } from '../identifier'
import { getType } from '../helpers'

const $function: TypeIdentifier<AnyFunction> = createIdentifier(
  describeType({ name: 'function', validate: (v): v is AnyFunction => typeof v === 'function' })
)
const $class: TypeIdentifier<new () => object> = createIdentifier(
  describeType({ name: 'class', validate: (v): v is new () => object => getType(v) === 'class' })
)
const $AnyFunction: TypeIdentifier<AnyFunction> = createIdentifier(
  describeType({ name: 'AnyFunction', validate: (v): v is AnyFunction => typeof v === 'function' })
)
const $Function: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType({ name: 'Function', validate: (v): v is Generator<any> => getType(v) === 'Function' })
)
const $AsyncFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType({ name: 'AsyncFunction', validate: (v): v is Generator<any> => getType(v) === 'AsyncFunction' })
)
const $GeneratorFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType({ name: 'GeneratorFunction', validate: (v): v is Generator<any> => getType(v) === 'GeneratorFunction' })
)
const $AsyncGeneratorFunction: TypeIdentifier<Generator<any>> = createIdentifier(
  describeType({
    name: 'AsyncGeneratorFunction',
    validate: (v): v is Generator<any> => getType(v) === 'AsyncGeneratorFunction',
  })
)

export { $class, $function, $AnyFunction, $Function, $AsyncFunction, $GeneratorFunction, $AsyncGeneratorFunction }
