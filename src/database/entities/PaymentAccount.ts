import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentAccount {

  @PrimaryGeneratedColumn ()
  id: number;

  @Column()
  owner: string;

  @Column()
  bank: string;
  
}