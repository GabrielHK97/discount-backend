import { PersonAddress } from "src/resources/person-address/entities/person-address.entity";
import { SexEnum } from "src/utils/enums/sex.enum";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({length: 11})
    cpf: string;

    @Column()
    birthDate: string;

    @Column()
    sex: SexEnum;

    @Column()
    email: string;

    @Column()
    phone: string;

    @OneToOne(() => PersonAddress,  {onDelete: 'CASCADE'})
    @JoinColumn()
    address: PersonAddress;
}
