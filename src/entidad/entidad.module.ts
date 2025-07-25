import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadService } from './entidad.service';
import { EntidadController } from './entidad.controller';
import { Entidad } from './entidad.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entidad]),
    UsersModule,
  ],
  providers: [EntidadService],
  controllers: [EntidadController],
})
export class EntidadModule {}
