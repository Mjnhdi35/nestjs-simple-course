import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../user/dtos/create-user.dto'
import { LoginUserDto } from './dtos/login.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto)
    this.authService.addRefreshTokenToResponse(res, result.refreshToken)
    return result
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto)
    this.authService.addRefreshTokenToResponse(res, result.refreshToken)
    return result
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies[this.authService['refreshCookieName']]
    const result = await this.authService.refresh(token)
    this.authService.addRefreshTokenToResponse(res, result.refreshToken)
    return result
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
    return { message: 'Logged out' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    return req.user
  }
}
