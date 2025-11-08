import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      example: {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com',
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findById(@Param('id') id: number) {
    return this.usersService.findById(Number(id));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description:
      'Retorna lista de todos os usuários exceto o usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      example: [
        {
          id: 2,
          name: 'Maria Silva',
          email: 'maria@email.com',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 3,
          name: 'Pedro Santos',
          email: 'pedro@email.com',
          createdAt: '2023-01-02T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async findAll(@CurrentUser() userId: number) {
    return this.usersService.findAll(userId);
  }
}
