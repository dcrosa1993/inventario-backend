import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Entidad } from '../entidad/entidad.entity';
import { Product } from 'src/product/product.entity';

export enum MovementType {
  VENTA = 'venta',
  COMPRA = 'compra',
  MOVIMIENTO = 'movimiento',
  RETIRO = 'retiro',
}

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @ManyToOne(() => Product, product => product.id, { eager: true, onDelete: 'RESTRICT' })
  producto: Product;

  @Column('decimal')
  price: number; 

  @ManyToOne(() => Entidad, entidad => entidad.id, { eager: true, onDelete: 'RESTRICT' })
  entidad: Entidad; 

  @ManyToOne(() => Entidad, entidad => entidad.id, { eager: true, nullable: true, onDelete: 'RESTRICT' })
  targetEntidad?: Entidad; 

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'enum', enum: ['active', 'deleted'], default: 'active' })
  status: 'active' | 'deleted';
}
