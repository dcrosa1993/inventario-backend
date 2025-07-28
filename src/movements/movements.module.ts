import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadModule } from '../entidad/entidad.module';
import { Movement } from './movements.entity';
import { ProductModule } from 'src/product/product.module';
import { MovementService } from './movements.service';
import { MovementController } from './movements.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    ProductModule,
    EntidadModule,
  ],
  providers: [MovementService],
  controllers: [MovementController],
})
export class MovementModule {}
