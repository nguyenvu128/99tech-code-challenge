import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from ".";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedAt: Date;
}
