import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { BaseEntity } from './base-entity';

@Entity()
export class Expense extends BaseEntity {
  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => User, (user) => user.expenses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user?: User;

  @Column()
  date: Date;

  @Column()
  description: string;
}
