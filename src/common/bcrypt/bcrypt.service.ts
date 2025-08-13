import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { IHashService } from '../types/hash.service.interface'

@Injectable()
export class BcryptService implements IHashService {
  private readonly saltRounds: number

  constructor(private readonly configService: ConfigService) {
    const rounds = this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10')
    this.saltRounds = parseInt(rounds, 10)
  }

  async hash(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds)
    return bcrypt.hash(data, salt)
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted)
  }
}
