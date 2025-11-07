import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.usersService.findById(Number(id));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    const userId =
      typeof req.user === 'object' && 'sub' in req.user
        ? Number(req.user.sub)
        : undefined;
    return this.usersService.findAll(userId);
  }
}
