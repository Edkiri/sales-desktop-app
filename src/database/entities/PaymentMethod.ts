import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentMethod {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

}