import { CouponDto } from "./coupon.dto";

export class CouponListDto {
    coupons: CouponDto[];
    totalItems: number;
    page: number;
}