import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Currency {

  @PrimaryGeneratedColumn ()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar", {
    nullable: true
  })
  symbol: string;
}