import { StoreAddress } from "src/resources/store-address/entities/store-address.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    realName: string;

    @Column()
    fantasyName: string;

    @Column({length: 14})
    cnpj: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToOne(() => StoreAddress, {onDelete: 'CASCADE'})
    @JoinColumn()
    address: StoreAddress
}
