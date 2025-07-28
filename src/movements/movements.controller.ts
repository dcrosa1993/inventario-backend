import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';
import { MovementType } from './movements.entity';
import { MovementService } from './movements.service';

class CreateMovementDto {
  @ApiProperty({ enum: MovementType })
  type: MovementType;

  @ApiProperty({ example: 'UUID del producto' })
  productoId: string;

  @ApiProperty({ example: 123.45 })
  price: number;

  @ApiProperty({ example: 'UUID de la entidad origen' })
  entidadId: string;

  @ApiProperty({ required: false, example: 'UUID de la entidad destino (sólo MOVIMIENTO)' })
  targetEntidadId?: string;
}

class ChangeStatusDto {
  @ApiProperty({ enum: ['active', 'deleted'] })
  status: 'active' | 'deleted';
}

@ApiTags('movements')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('movements')
export class MovementController {
  constructor(private movementService: MovementService) {}

  @ApiOperation({ summary: 'Registrar un movimiento de producto' })
  @ApiBody({ type: CreateMovementDto })
  @Post()
  create(@Request() req, @Body() dto: CreateMovementDto) {
    return this.movementService.create({
      ...dto,
    });
  }

  @ApiOperation({ summary: 'Listar movimientos del usuario' })
  @Get()
  list(@Request() req) {
    return this.movementService.findAllByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Cambiar status de un registro' })
  @ApiBody({ type: ChangeStatusDto })
  @Patch(':id/status')
  changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
    return this.movementService.changeStatus(id, dto.status);
  }
}
