import { Coupon } from "src/resources/coupon/entities/coupon.entity";
import { Person } from "src/resources/person/entities/person.entity";
import { StoreAddress } from "src/resources/store-address/entities/store-address.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({nullable: true})
    email: string;

    @Column()
    phone: string;

    @Column()
    qrcodeActive: boolean;

    @OneToOne(() => StoreAddress, {onDelete: 'CASCADE'})
    @JoinColumn()
    address: StoreAddress

    @OneToMany(() => Coupon, (coupon) => coupon.store, {nullable: true})
    coupons: Coupon[]
}
