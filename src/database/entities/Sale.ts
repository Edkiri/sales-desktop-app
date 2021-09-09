import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Client } from "./Client";
import { Payment } from "./Payment";
import { Order } from "./Order";

@Entity()
export class Sale {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column("date")
  date: Date;

  @ManyToOne('Client')
  client: Client;

  @Column("varchar", {
    length: 300,
    nullable: true
  })
  description: string;

  @OneToMany('Payment', (payment: Payment) => payment.sale, {
    onDelete: "CASCADE",
    nullable: true
  })
  payments: Array<Payment>;

  @OneToMany('Order', (order: Order) => order.sale, {
    onDelete: "CASCADE",
    nullable: true
  })
  orders: Array<Order>;

  @Column({
    nullable: true,
    default: false
  })
  isFinished: boolean;
}