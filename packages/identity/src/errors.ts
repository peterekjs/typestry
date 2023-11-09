import type { TypeDescription } from './definitions'

class AssertionError extends Error {
  constructor(conditionDescription: string, options?: ErrorOptions) {
    super(`Expected ${conditionDescription}`, options)
    this.name = 'AssertionError'
  }
}
class TypeAssertionError<T> extends AssertionError {
  expected: TypeDescription<T>
  received: any

  constructor(description: TypeDescription<T>, received: any) {
    super(description.name, { cause: { expected: description, received } })
    this.name = 'TypeAssertionError'
    this.expected = description
    this.received = received
  }
}

export { AssertionError, TypeAssertionError }
