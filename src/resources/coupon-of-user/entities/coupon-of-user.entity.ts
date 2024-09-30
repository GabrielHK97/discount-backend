import { Coupon } from "src/resources/coupon/entities/coupon.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CouponOfUser {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    claimed: boolean;

    @ManyToMany(() => Coupon, (coupons) => coupons.couponsOfUser)
    coupons: Coupon[]
}
