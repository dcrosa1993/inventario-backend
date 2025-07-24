import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hash });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.repo.remove(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}