import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from 'src/product/product.entity';

@Entity()
export class Entidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => User, (user) => user.entidades, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];
}
