import { CouponOfUser } from "src/resources/coupon-of-user/entities/coupon-of-user.entity";
import { Person } from "src/resources/person/entities/person.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    qrcodeActive: boolean;

    @OneToOne(() => Person, {onDelete: 'CASCADE'})
    person: Person

    @OneToOne(() => CouponOfUser)
    couponOfUser: CouponOfUser

}
