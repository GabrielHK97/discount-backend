import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreAddress {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    place: string;

    @Column()
    number: string;

    @Column()
    complement: string;

    @Column()
    zipCode: string;

    @Column()
    neighborhood: string;
    
    @Column()
    city: string;

    @Column()
    state: string;
}
