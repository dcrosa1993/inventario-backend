import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';
import { ProductService } from './product.service';

class CreateProductDto {
  @ApiProperty() name: string;
  @ApiProperty() quantity: number;
  @ApiProperty() purchasePrice: number;
  @ApiProperty() salePrice: number;
  @ApiProperty({ required: false }) observation?: string;
  @ApiProperty({ required: false }) entidadId?: string;
}

@ApiTags('products')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private productoService: ProductService) {}

  @ApiOperation({ summary: 'Crear producto para usuario y entidad' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@Request() req, @Body() dto: CreateProductDto) {
    return this.productoService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Listar productos del usuario' })
  @Get()
  list(@Request() req) {
    return this.productoService.findAllByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Actualizar producto por ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productoService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar producto por ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(id);
  }
}
