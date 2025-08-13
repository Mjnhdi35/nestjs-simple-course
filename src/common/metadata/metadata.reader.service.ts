import { Injectable, Logger } from '@nestjs/common'
import {
  RUNTIME_CHECK_KEY,
  PROPERTY_META_KEY,
  PARAM_META_KEY,
} from './constants'

@Injectable()
export class MetadataReaderService {
  private readonly logger = new Logger(MetadataReaderService.name)

  getClassMetadata(instance: any) {
    return Reflect.getMetadata(RUNTIME_CHECK_KEY, instance.constructor) || null
  }

  getMethodMetadata(instance: any, methodName: string) {
    return Reflect.getMetadata(RUNTIME_CHECK_KEY, instance, methodName) || null
  }

  getPropertyMetadata(instance: any) {
    return Reflect.getMetadata(PROPERTY_META_KEY, instance) || null
  }

  getParamMetadata(instance: any, methodName: string) {
    return Reflect.getMetadata(PARAM_META_KEY, instance, methodName) || null
  }

  logAllMetadata(instance: any, methodName: string) {
    this.logger.log(
      `Class meta: ${JSON.stringify(this.getClassMetadata(instance))}`,
    )
    this.logger.log(
      `Method meta: ${JSON.stringify(this.getMethodMetadata(instance, methodName))}`,
    )
    this.logger.log(
      `Property meta: ${JSON.stringify(this.getPropertyMetadata(instance))}`,
    )
    this.logger.log(
      `Param meta: ${JSON.stringify(this.getParamMetadata(instance, methodName))}`,
    )
  }
}
