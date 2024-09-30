import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PersonAddress {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    place: string;

    @Column({nullable: true})
    number: string;

    @Column({nullable: true})
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
