import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { EntidadService } from '../entidad/entidad.service';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
    private usersService: UsersService,
    private entidadService: EntidadService,
  ) {}

  async findOne(id: string): Promise<Product> {
    const producto = await this.repo.findOne({
      where: { id },
      relations: ['user', 'entidad'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async create(
    userId: string,
    data: {
      name: string;
      quantity: number;
      purchasePrice: number;
      salePrice: number;
      observation?: string;
      entidadId?: string;
    },
  ) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    let entidad;
    if (data.entidadId) {
      entidad = await this.entidadService.update(data.entidadId, {});
    } else {
      const entidades = await this.entidadService.findAllByUser(userId);
      entidad = entidades.find((e) => e.name === 'Almacen');
      if (!entidad)
        throw new NotFoundException('Entidad "Almacen" no encontrada');
    }

    const producto = this.repo.create({
      ...data,
      user,
      entidad,
    });
    return this.repo.save(producto);
  }

  findAllByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['entidad'],
    });
  }

  async update(id: string, data: Partial<Product>) {
    const producto = await this.repo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    Object.assign(producto, data);
    return this.repo.save(producto);
  }

  async remove(id: string) {
    const producto = await this.repo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return this.repo.remove(producto);
  }
}
