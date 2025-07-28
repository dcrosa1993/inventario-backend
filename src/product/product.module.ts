import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { UsersModule } from '../users/users.module';
import { EntidadModule } from '../entidad/entidad.module';
import { Product } from './product.entity';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    UsersModule,
    EntidadModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
