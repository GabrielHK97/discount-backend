import { Column, PrimaryGeneratedColumn } from "typeorm";

export class AddressEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    place: string;

    @Column({nullable: true})
    number: string;

    @Column({ nullable: true})
    complement: string;

    @Column()
    zipCode: string;

    @Column({nullable: true})
    neighborhood: string;
    
    @Column()
    city: string;

    @Column()
    state: string;
}