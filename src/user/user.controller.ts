import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { UpdateUserDto } from './dtos/update-user.dto'
import { AuthRequest } from '../common/types/auth.req.interface'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user?.id !== id) {
      throw new UnauthorizedException('Cannot update other users')
    }
    return this.userService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: AuthRequest) {
    if (req?.user?.id !== id) {
      throw new UnauthorizedException('Cannot delete other users')
    }
    await this.userService.delete(id)
    return { message: 'User deleted successfully' }
  }
}
