import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './resources/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './resources/admin/entities/admin.entity';
import { PersonModule } from './resources/person/person.module';
import { StoreModule } from './resources/store/store.module';
import { StoreAddressModule } from './resources/store-address/store-address.module';
import { CouponModule } from './resources/coupon/coupon.module';
import { CouponOfUserModule } from './resources/coupon-of-user/coupon-of-user.module';
import { PersonAddressModule } from './resources/person-address/person-address.module';
import { UserModule } from './resources/user/user.module';
import * as dotenv from 'dotenv';
import { Store } from './resources/store/entities/store.entity';
import { StoreAddress } from './resources/store-address/entities/store-address.entity';
import { Person } from './resources/person/entities/person.entity';
import { User } from './resources/user/entities/user.entity';
import { PersonAddress } from './resources/person-address/entities/person-address.entity';
import { Coupon } from './resources/coupon/entities/coupon.entity';
import { CouponOfUser } from './resources/coupon-of-user/entities/coupon-of-user.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DS_HOST,
      port: +process.env.DS_PORT,
      username: process.env.DS_USERNAME,
      password: process.env.DS_PASSWORD,
      database: process.env.DS_DATABASE,
      schema: process.env.DS_SCHEMA,
      entities: [
        Admin,
        Store,
        StoreAddress,
        User,
        Person,
        PersonAddress,
        Coupon,
        CouponOfUser,
      ],
      synchronize: true,
    }),
    AdminModule,
    PersonModule,
    StoreModule,
    StoreAddressModule,
    CouponModule,
    CouponOfUserModule,
    PersonAddressModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
