import { ListCouponDto } from '../dto/list-coupon.dto';
import { Coupon } from '../entities/coupon.entity';

export class CouponConverter {
  static CouponToListCouponDto(coupon: Coupon) {
    const dto = new ListCouponDto();
    dto.name = coupon.name;
    dto.description = coupon.description;
    dto.usage = coupon.hasLimit ? `${coupon.used}/${coupon.limit}` : '-';
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
