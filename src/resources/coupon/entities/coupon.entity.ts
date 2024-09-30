import { CouponOfUser } from "src/resources/coupon-of-user/entities/coupon-of-user.entity";
import { Store } from "src/resources/store/entities/store.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    hasPeriod: boolean;

    @Column()
    dateStart: Date;

    @Column()
    dateEnd: Date;

    @Column()
    hasLimit: boolean;

    @Column()
    limit: number;

    @Column()
    used: number;

    @Column()
    hasValue: boolean;

    @Column()
    value: number;

    @Column()
    hasPercentage: boolean;

    @Column()
    percentage: number;

    @ManyToOne(() => Store, (store) => store.coupons)
    store: Store;

    @ManyToMany(() => CouponOfUser, (couponsOfUser) => couponsOfUser.coupons)
    couponsOfUser: CouponOfUser[]
}
