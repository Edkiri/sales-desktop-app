import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
  
  @PrimaryGeneratedColumn ()
  id: number;
  
  @Column("varchar", {
    length: 50
  })
  name: string;
  
  @Column({
    unique: true
  })
  identityCard: string;
  
  @Column("varchar", { 
    length: 60,
    nullable: true
  })
  phoneNumber: string;
}