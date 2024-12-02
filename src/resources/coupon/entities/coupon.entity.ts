import { format } from 'date-fns';
import { CouponOfUser } from 'src/resources/coupon-of-user/entities/coupon-of-user.entity';
import { Store } from 'src/resources/store/entities/store.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Coupon extends BaseEntity {

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  hasPeriod: boolean;

  @Column({
    nullable: true,
    transformer: {
      to(date: Date) {
        return date;
      },
      from(date: Date) {
        return format(date, 'dd/MM/yyyy');
      },
    },
  })
  dateStart: Date;

  @Column({
    nullable: true,
    transformer: {
      to(date: Date) {
        return date;
      },
      from(date: Date) {
        return format(date, 'dd/MM/yyyy');
      },
    },
  })
  dateEnd: Date;

  @Column()
  hasLimit: boolean;

  @Column({ nullable: true })
  limit: number;

  @Column()
  hasLimitPerUser: boolean;

  @Column({ nullable: true })
  limitPerUser: number;

  @Column()
  hasValue: boolean;

  @Column({
    nullable: true,
    transformer: {
      to(value: number ) {
        return value ? Number.parseFloat(value.toFixed(2)) : null;
      },
      from(value: number) {
        return value;
      },
    },
  })
  value: number;

  @Column()
  hasPercentage: boolean;

  @Column({ nullable: true })
  percentage: number;

  @ManyToOne(() => Store, (store) => store.coupons)
  store: Store;

  @Column()
  storeId: string;

  @ManyToMany(() => CouponOfUser, (couponsOfUser) => couponsOfUser.coupons)
  couponsOfUser: CouponOfUser[];
}
