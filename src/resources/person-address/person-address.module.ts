import { Module } from '@nestjs/common';
import { PersonAddressService } from './person-address.service';
import { PersonAddressController } from './person-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonAddress } from './entities/person-address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonAddress]),
  ],
  controllers: [PersonAddressController],
  providers: [PersonAddressService]
})
export class PersonAddressModule {}
