import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from '../user/dtos/create-user.dto'
import { LoginUserDto } from './dtos/login.dto'
import { Response } from 'express'

@Injectable()
export class AuthService {
  private readonly accessExpire: string
  private readonly refreshExpire: string
  private readonly refreshCookieName: string
  private readonly refreshCookieDays: number

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.accessExpire = this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN')
    this.refreshExpire = this.config.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    )
    this.refreshCookieName = this.config.getOrThrow<string>(
      'JWT_REFRESH_COOKIE_NAME',
    )
    this.refreshCookieDays = this.config.getOrThrow<number>(
      'JWT_REFRESH_COOKIE_DAYS',
    )
  }

  private async signToken(
    userId: string,
    expiresIn: string,
    secretKey?: string,
  ) {
    const secret = secretKey ?? this.config.getOrThrow<string>('JWT_SECRET')
    return this.jwtService.signAsync({ userId }, { secret, expiresIn })
  }

  async issueTokens(userId: string) {
    const accessToken = await this.signToken(userId, this.accessExpire)
    const refreshToken = await this.signToken(
      userId,
      this.refreshExpire,
      this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    )
    return { accessToken, refreshToken }
  }

  addRefreshTokenToResponse(res: Response, token: string) {
    const maxAge = this.refreshCookieDays * 24 * 60 * 60 * 1000
    res.cookie(this.refreshCookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    })
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.clearCookie(this.refreshCookieName, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  }

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto)
    const tokens = await this.issueTokens(user.id)
    return { user, ...tokens }
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.getByEmail(dto.email)
    if (!user) throw new NotFoundException('User not found')

    const valid = await this.userService.validatePassword(user, dto.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.issueTokens(user.id)
    return { user, ...tokens }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ userId: string }>(
        refreshToken,
        { secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET') },
      )
      const user = await this.userService.getById(payload.userId)
      const tokens = await this.issueTokens(user.id)
      return { user, ...tokens }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
