import { Controller, Post, Get, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';

class CreateEntidadDto {
  @ApiProperty() name: string;
  @ApiProperty({ required: false }) address?: string;
  @ApiProperty({ required: false }) phone?: string;
}

@ApiTags('entidades')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('entidades')
export class EntidadController {
  constructor(private entidadService: EntidadService) {}

  @ApiOperation({ summary: 'Crear entidad para usuario autenticado' })
  @ApiBody({ type: CreateEntidadDto })
  @Post()
  create(@Request() req, @Body() dto: CreateEntidadDto) {
    return this.entidadService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Listar entidades del usuario' })
  @Get()
  list(@Request() req) {
    return this.entidadService.findAllByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Actualizar entidad por ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEntidadDto>) {
    return this.entidadService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar entidad por ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entidadService.remove(id);
  }
}
