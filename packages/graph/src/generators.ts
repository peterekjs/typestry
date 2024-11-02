type IterableSource<T> = Iterable<T> | AsyncIterable<T>

export async function* of<T>(input: IterableSource<T>): AsyncIteratorObject<T, BuiltinIteratorReturn> {
  for await (const value of input) {
    yield value
  }
}

export function filter<T>(condition: (value: T) => boolean, input: IterableSource<T>): AsyncIteratorObject<T, BuiltinIteratorReturn>
export function filter<T>(condition: (value: T) => boolean): (input: IterableSource<T>) => AsyncIteratorObject<T, BuiltinIteratorReturn>
export function filter<T>(...args: [condition: (value: T) => boolean, input: IterableSource<T>] | [condition: (value: T) => boolean]) {
  if (args.length === 2) {
    return _filter(...args)
  }
  if (args.length === 1) {
    const condition = args.at(0)!
    return (input: IterableSource<T>) => _filter(condition, input)
  }
  throw new RangeError('Wrong number of arguments')

  async function* _filter<T>(condition: (value: T) => boolean, input: IterableSource<T>): AsyncIteratorObject<T, BuiltinIteratorReturn> {
    for await (const value of input) {
      if (!condition(value)) continue
      yield value
    }
  }
}

export function map<T, S>(mapper: (value: T) => S, input: IterableSource<T>): AsyncIteratorObject<S, BuiltinIteratorReturn>
export function map<T, S>(mapper: (value: T) => S): (input: IterableSource<T>) => AsyncIteratorObject<S, BuiltinIteratorReturn>
export function map<T, S>(...args: [mapper: (value: T) => S, input: IterableSource<T>] | [mapper: (value: T) => S]) {
  if (args.length === 2) {
    return _map(...args)
  }
  if (args.length === 1) {
    const mapper = args.at(0)!
    return (input: IterableSource<T>) => _map(mapper, input)
  }
  throw new RangeError('Wrong number of arguments')

  async function* _map<T, S>(mapper: (value: T) => S, input: IterableSource<T>): AsyncIteratorObject<S, BuiltinIteratorReturn> {
    for await (const value of input) {
      yield mapper(value)
    }
  }
}

export async function* merge<T>(...sources: (IterableSource<T>)[]) {
  for (const source of sources) {
    for await (const value of source) {
      yield value
    }
  }
}
