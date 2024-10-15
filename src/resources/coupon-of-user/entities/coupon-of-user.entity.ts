import { Coupon } from "src/resources/coupon/entities/coupon.entity";
import { User } from "src/resources/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CouponOfUser {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    claimed: boolean;

    @Column()
    claimedAt: Date;

    @Column()
    used: number;

    @ManyToMany(() => Coupon, (coupons) => coupons.couponsOfUser)
    coupons: Coupon[]

    @ManyToOne(() => User, (user) => user.couponsOfUser)
    user: User;
}
