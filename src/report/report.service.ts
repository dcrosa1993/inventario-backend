// src/report/report.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntidadService } from '../entidad/entidad.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ClosingReportDto } from './dto/closing-report.dto';
import { ProductService } from 'src/product/product.service';
import { Movement, MovementType } from 'src/movements/movements.entity';
import { ClosingReportResponseDto } from './dto/closing-report-response.dto';

@Injectable()
export class ReportService {
  constructor(
    private entidadService: EntidadService,
    private productoService: ProductService,
    @InjectRepository(Movement)
    private movementRepo: Repository<Movement>,
  ) {}

  /** 
   * Genera el reporte de cierre:
   * - totalProducts: suma de cantidades de productos en la entidad
   * - totalIncome: suma de precios de movimientos de tipo VENTA en el rango
   */
  async closingReport(userId: string, dto: ClosingReportDto): Promise<ClosingReportResponseDto> {
  // 1) Validar entidad
  const entidad = await this.entidadService.findOne(dto.entidadId!);
  if (entidad.user.id !== userId) {
    throw new NotFoundException(`Entidad no encontrada para el usuario`);
  }

  // 2) Productos de la entidad
  const productos = await this.productoService.findAllByUser(userId);
  const productosEnEntidad = productos.filter(p => p.entidad.id === dto.entidadId);

  const totalProducts = productosEnEntidad.reduce((sum, p) => sum + p.quantity, 0);

  // 3) Movimientos en rango
  const startDate = new Date(dto.start);
  const endDate = new Date(dto.end);
  const movimientos = await this.movementRepo.find({
    where: {
      entidad: { id: dto.entidadId },
      timestamp: Between(startDate, endDate),
      status: 'active',
    },
    relations: ['producto'],
    order: { timestamp: 'DESC' },
  });

  // 4) Calcular totalIncome (solo ventas)
  const ventas = movimientos.filter(m => m.type === MovementType.VENTA);
  const totalIncome = ventas.reduce((sum, m) => sum + Number(m.price), 0);

  // 5) Detalle por producto
  const productDetails = productosEnEntidad.map(p => ({
    id: p.id,
    name: p.name,
    quantity: p.quantity,
    purchasePrice: Number(p.purchasePrice),
    salePrice: Number(p.salePrice),
    observation: p.observation,
  }));

  // 6) Agrupar movimientos por tipo
  const movementDetails = Object.values(MovementType).reduce((acc, type) => {
    acc[type] = movimientos
      .filter(m => m.type === type)
      .map(m => ({
        type: m.type,
        id: m.id,
        productoId: m.producto.id,
        price: Number(m.price),
        timestamp: m.timestamp,
      }));
    return acc;
  }, {} as Record<MovementType, any[]>);

  // 7) Devolver respuesta
  return {
    totalProducts,
    totalIncome,
    entidadId: entidad.id,
    entidadName: entidad.name,
    productDetails,
    movementDetails,
  };
}
}
