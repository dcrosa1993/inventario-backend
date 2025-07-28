import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entidad } from './entidad.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EntidadService {

  constructor(
    @InjectRepository(Entidad)
    private repo: Repository<Entidad>,
    private usersService: UsersService,
  ) {}

  async findOne(id: string): Promise<Entidad> {
    const entidad = await this.repo.findOne({
      where: { id },
      relations: ['user'],  
    });
    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }
    return entidad;
  }

  async create(userId: string, data: { name: string; address?: string; phone?: string }) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const entidad = this.repo.create({ ...data, user });
    return this.repo.save(entidad);
  }

  findAllByUser(userId: string) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async update(id: string, data: Partial<Entidad>) {
    const entidad = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!entidad) throw new NotFoundException('Entidad no encontrada');
    Object.assign(entidad, data);
    return this.repo.save(entidad);
  }

  async remove(id: string) {
    const entidad = await this.repo.findOne({ where: { id } });
    if (!entidad) throw new NotFoundException('Entidad no encontrada');
    return this.repo.remove(entidad);
  }
}
