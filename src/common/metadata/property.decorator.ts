import { PROPERTY_META_KEY } from './constants'

export function PropertyMeta(metaValue: any) {
  return (target: any, propertyKey: string | symbol) => {
    const existingMeta = Reflect.getMetadata(PROPERTY_META_KEY, target) || {}
    existingMeta[propertyKey] = metaValue
    Reflect.defineMetadata(PROPERTY_META_KEY, existingMeta, target)
  }
}
