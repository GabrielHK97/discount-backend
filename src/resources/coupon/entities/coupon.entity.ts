import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;
}
