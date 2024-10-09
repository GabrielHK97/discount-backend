import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ServiceData } from 'src/utils/classes/ServiceData.class';
import { extractTokenFromHeader } from 'src/utils/functions/extractTokenFromHeader.function';
import { Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';
import { CouponConverter } from './converters/coupon.converter';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ListCouponDto } from './dto/list-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}

  isPercentageGreaterThan100(percentage: number) {
    return percentage > 100;
  }

  async create(
    req: Request,
    createCouponDto: CreateCouponDto,
  ): Promise<ServiceData> {
    try {
      if (
        this.isPercentageGreaterThan100(createCouponDto.percentage) &&
        createCouponDto.hasPercentage
      ) {
        return new ServiceData(
          HttpStatus.BAD_REQUEST,
          'Não foi possível criar cupom!',
        );
      }
      const token = extractTokenFromHeader('storeToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const store = await this.storeRepository.findOneByOrFail({
        username: payload.username,
      });
      const coupon = this.couponRepository.create(createCouponDto);
      coupon.used = 0;
      coupon.storeId = store.id;
      await this.couponRepository.save(coupon);
      return new ServiceData(HttpStatus.OK, 'Criado com sucesso!');
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        'Não foi possível criar cupom!',
      );
    }
  }

  async findAll(): Promise<ServiceData<ListCouponDto[]>> {
    try {
      const coupons = (await this.couponRepository.find()).map((coupon) => {
        return CouponConverter.CouponToListCouponDto(coupon);
      });
      return new ServiceData<ListCouponDto[]>(
        HttpStatus.OK,
        'Listado com sucesso!',
        coupons,
      );
    } catch (error) {
      new ServiceData(HttpStatus.BAD_REQUEST, 'Não foi possível listar cupons');
    }
  }

  async findOne(id: string): Promise<ServiceData<ListCouponDto>> {
    try {
      const coupon = CouponConverter.CouponToListCouponDto(
        await this.couponRepository.findOneByOrFail({ id }),
      );
      return new ServiceData<ListCouponDto>(
        HttpStatus.OK,
        'Achado com sucesso!',
        coupon,
      );
    } catch (error) {
      new ServiceData(HttpStatus.BAD_REQUEST, 'Não foi possível achar o cupom');
    }
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
