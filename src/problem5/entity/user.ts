import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Token } from "./token";
import { Product } from ".";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
