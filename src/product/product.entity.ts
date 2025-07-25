import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Entidad } from 'src/entidad/entidad.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  purchasePrice: number;

  @Column('decimal')
  salePrice: number;

  @Column({ nullable: true })
  observation?: string;

  @ManyToOne(() => User, user => user.entidades, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Entidad, entidad => entidad.products, { onDelete: 'CASCADE' })
  entidad: Entidad;
}
