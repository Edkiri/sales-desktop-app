import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    length: 50,
    nullable: true
  })
  brand: string;

  @Column({
    nullable: true
  })
  reference: string; 
  
  @Column({
    unique: true,
    nullable: true
  })
  code: number;

  @Column("varchar", {
    length: 500,
  })
  name: string;
  
  @Column("decimal", {
    nullable: true
  })
  price: number;

  @Column("smallint")
  stock: number;
}