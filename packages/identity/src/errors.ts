import type { TypeDescriptor } from './definitions'

class AssertionError extends Error {
  constructor(conditionDescriptor: string, options?: ErrorOptions) {
    super(`Expected ${conditionDescriptor}`, options)
    this.name = 'AssertionError'
  }
}
class TypeAssertionError<T> extends AssertionError {
  expected: TypeDescriptor<T>
  received: any

  constructor(descriptor: TypeDescriptor<T>, received: any) {
    super(descriptor.name, { cause: { expected: descriptor, received } })
    this.name = 'TypeAssertionError'
    this.expected = descriptor
    this.received = received
  }
}

export { AssertionError, TypeAssertionError }
