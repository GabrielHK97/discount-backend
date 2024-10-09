export class CreateCouponDto {
    name: string;
    description: string;
    hasPeriod: boolean;
    dateStart: Date;
    dateEnd: Date;
    hasLimit: boolean;
    limit: number;
    used: number;
    hasValue: boolean;
    value: number;
    hasPercentage: boolean;
    percentage: number;
    storeId: string;
}
