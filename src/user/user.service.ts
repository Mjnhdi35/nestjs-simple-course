import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BcryptService } from '../common/bcrypt/bcrypt.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async create(body: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: { email: body.email },
    })
    if (exists) throw new BadRequestException('Email already exists')

    const hashed = await this.bcryptService.hash(body.password)
    const user = this.userRepository.create({ ...body, password: hashed })
    return this.userRepository.save(user)
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return this.bcryptService.compare(password, user.password)
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.getById(id)

    if (body.password) {
      body.password = await this.bcryptService.hash(body.password)
    }

    Object.assign(user, body)
    return this.userRepository.save(user)
  }

  async delete(id: string): Promise<void> {
    const user = await this.getById(id)
    await this.userRepository.remove(user)
  }
}
