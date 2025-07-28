// src/report/report.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { EntidadModule } from '../entidad/entidad.module';
import { ProductModule } from 'src/product/product.module';
import { Movement } from 'src/movements/movements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    EntidadModule,
    ProductModule,
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
