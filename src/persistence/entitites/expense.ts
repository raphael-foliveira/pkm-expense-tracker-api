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
