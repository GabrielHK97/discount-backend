import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonAddressService } from './person-address.service';
import { CreatePersonAddressDto } from './dto/create-person-address.dto';
import { UpdatePersonAddressDto } from './dto/update-person-address.dto';

@Controller('person-address')
export class PersonAddressController {
  constructor(private readonly personAddressService: PersonAddressService) {}

  @Post()
  create(@Body() createPersonAddressDto: CreatePersonAddressDto) {
    return this.personAddressService.create(createPersonAddressDto);
  }

  @Get()
  findAll() {
    return this.personAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonAddressDto: UpdatePersonAddressDto) {
    return this.personAddressService.update(+id, updatePersonAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personAddressService.remove(+id);
  }
}
