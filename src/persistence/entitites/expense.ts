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

const { NODE_ENV } = process.env;

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'double' })
  price: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;

  @Column(NODE_ENV === 'test' ? 'datetime' : '')
  date: Date;

  @Column()
  description: string;
}
