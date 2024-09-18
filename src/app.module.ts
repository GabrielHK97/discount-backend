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
import * as dotenv from 'dotenv';

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
      entities: [Admin],
      synchronize: true,
    }),
    AdminModule,
    PersonModule,
    StoreModule,
    StoreAddressModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
