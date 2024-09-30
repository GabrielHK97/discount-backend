import { Test, TestingModule } from '@nestjs/testing';
import { PersonAddressController } from './person-address.controller';
import { PersonAddressService } from './person-address.service';

describe('PersonAddressController', () => {
  let controller: PersonAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonAddressController],
      providers: [PersonAddressService],
    }).compile();

    controller = module.get<PersonAddressController>(PersonAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
