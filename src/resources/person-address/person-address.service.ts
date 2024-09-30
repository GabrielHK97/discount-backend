import { Injectable } from '@nestjs/common';
import { CreatePersonAddressDto } from './dto/create-person-address.dto';
import { UpdatePersonAddressDto } from './dto/update-person-address.dto';

@Injectable()
export class PersonAddressService {
  create(createPersonAddressDto: CreatePersonAddressDto) {
    return 'This action adds a new personAddress';
  }

  findAll() {
    return `This action returns all personAddress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personAddress`;
  }

  update(id: number, updatePersonAddressDto: UpdatePersonAddressDto) {
    return `This action updates a #${id} personAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} personAddress`;
  }
}
