import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @Post()
  create(@Body() body: { email: string; password: string; role?: UserRole }): Promise<User> {
    return this.usersService.create(body.email, body.password, body.role);
  }

  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @Get()
  list(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<User>,
  ) {
    return this.usersService.update(id, body);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}