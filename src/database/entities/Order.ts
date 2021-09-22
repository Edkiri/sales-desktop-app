import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Sale } from "./Sale";
import { Product } from "./Product";

@Entity()
export class Order {
  
  @PrimaryGeneratedColumn ()
  id: number;

  @ManyToOne(() => Sale, sale => sale.orders)
  sale: Sale;

  @ManyToOne('Product')
  product: Product;

  @Column({
    type: "float"
  })
  amount: number;

  @Column({
    type: "date"
  })
  date: Date;

  @Column({
    type: "float"
  })
  price: number;

}