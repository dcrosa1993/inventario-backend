import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntidadService } from '../entidad/entidad.service';
import { Movement, MovementType } from './movements.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(Movement)
    private repo: Repository<Movement>,
    private productoService: ProductService,
    private entidadService: EntidadService,
  ) {}

  async create(data: {
    productoId: string;
    type: MovementType;
    price: number;
    entidadId: string;
    targetEntidadId?: string;
  }) {
    const producto = await this.productoService.findOne(data.productoId);
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const entidad = await this.entidadService.findOne(data.entidadId);
    if (!entidad) throw new NotFoundException('Entidad de origen no encontrada');

    let targetEntidad;
    if (data.type === MovementType.MOVIMIENTO) {
      if (!data.targetEntidadId) {
        throw new BadRequestException('targetEntidadId es obligatorio en MOVIMIENTO');
      }
      targetEntidad = await this.entidadService.findOne(data.targetEntidadId);
      if (!targetEntidad) throw new NotFoundException('Entidad destino no encontrada');
    }

    const movement = this.repo.create({
      type: data.type,
      producto,
      price: data.price,
      entidad,
      targetEntidad,
    });
    return this.repo.save(movement);
  }

  findAllByUser(userId: string) {
    // muestra todos los movimientos donde la entidad pertenece al usuario
    return this.repo.find({
      where: { entidad: { user: { id: userId } } },
      order: { timestamp: 'DESC' },
    });
  }

  async changeStatus(id: string, status: 'active' | 'deleted') {
    const mv = await this.repo.findOne({ where: { id } });
    if (!mv) throw new NotFoundException('Registro no encontrado');
    mv.status = status;
    return this.repo.save(mv);
  }
}
