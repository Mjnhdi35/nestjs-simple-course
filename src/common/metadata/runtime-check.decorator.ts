import { RUNTIME_CHECK_KEY } from './constants'

export function RuntimeCheck(metaValue: any) {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    if (propertyKey) {
      // Method-level metadata
      Reflect.defineMetadata(RUNTIME_CHECK_KEY, metaValue, target, propertyKey)
    } else {
      // Class-level metadata
      Reflect.defineMetadata(RUNTIME_CHECK_KEY, metaValue, target)
    }
  }
}
