import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from 'src/movements/movements.entity';

class ProductDetail {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  purchasePrice: number;

  @ApiProperty()
  salePrice: number;

  @ApiProperty({ required: false })
  observation?: string;
}

class MovementDetail {
  @ApiProperty({ enum: MovementType })
  type: MovementType;

  @ApiProperty()
  id: string;

  @ApiProperty()
  productoId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  timestamp: Date;
}

export class ClosingReportResponseDto {
  @ApiProperty()
  totalProducts: number;

  @ApiProperty()
  totalIncome: number;

  @ApiProperty()
  entidadId: string;

  @ApiProperty()
  entidadName: string;

  @ApiProperty({ type: [ProductDetail] })
  productDetails: ProductDetail[];

  @ApiProperty({ 
    description: 'Movimientos agrupados por tipo',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/MovementDetail' }
    }
  })
  movementDetails: Record<MovementType, MovementDetail[]>;
}
