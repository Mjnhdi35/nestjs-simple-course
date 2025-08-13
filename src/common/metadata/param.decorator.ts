import { PARAM_META_KEY } from './constants'

export function ParamMeta(metaValue: any) {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const existingMeta =
      Reflect.getMetadata(PARAM_META_KEY, target, propertyKey) || []
    existingMeta[parameterIndex] = metaValue
    Reflect.defineMetadata(PARAM_META_KEY, existingMeta, target, propertyKey)
  }
}
