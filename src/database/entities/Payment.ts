import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./Sale";
import { Currency } from "./Currency";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentAccount } from "./PaymentAccount";

@Entity()
export class Payment {
  
  @PrimaryGeneratedColumn ()
  id: number;

  @ManyToOne(() => Sale, sale => sale.payments)
  sale: Sale;

  @Column({
    type: "date"
  })
  date: Date;

  @Column({
    type: "float"
  })
  amount: number;

  @ManyToOne('Currency')
  currency: Currency;

  @ManyToOne('PaymentMethod')
  @JoinColumn({name: "methodId"})
  method: PaymentMethod;

  @Column({
    type: "float"
  })
  rate: number;

  @ManyToOne('PaymentAccount', {
    nullable: true
  })
  @JoinColumn({name: "accountId"})
  account: PaymentAccount;
  
}