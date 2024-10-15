import { CouponDto } from '../dto/coupon.dto';
import { Coupon } from '../entities/coupon.entity';

export class CouponConverter {
  static CouponToCouponDto(coupon: Coupon) {
    const dto = new CouponDto();
    dto.name = coupon.name;
    dto.description = coupon.description;
    dto.usage = coupon.hasLimit ? `${coupon.used}/${coupon.limit}` : coupon.used.toString();
    dto.limitPerUser = coupon.limitPerUser ? coupon.limitPerUser.toString() : '-';
    dto.period = coupon.hasPeriod
      ? `${coupon.dateStart} - ${coupon.dateEnd}`
      : '-';
    if (coupon.hasPercentage) {
      dto.amount = `${coupon.percentage}%`;
    }
    if (coupon.hasValue) {
      dto.amount = `R$ ${coupon.value.toFixed(2).replace('.', ',')}`;
    }
    return dto;
  }
}
