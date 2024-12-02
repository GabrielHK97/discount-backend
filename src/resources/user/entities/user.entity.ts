import { CouponOfUser } from "src/resources/coupon-of-user/entities/coupon-of-user.entity";
import { Person } from "src/resources/person/entities/person.entity";
import { BaseEntity, Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity()
export class User extends BaseEntity{

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    qrcodeActive: boolean;

    @OneToOne(() => Person, {onDelete: 'CASCADE'})
    person: Person

    @OneToMany(() => CouponOfUser, (couponOfUser) => couponOfUser.user)
    couponsOfUser: CouponOfUser[]

}
