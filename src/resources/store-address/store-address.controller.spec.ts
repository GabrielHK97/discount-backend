import { Test, TestingModule } from '@nestjs/testing';
import { StoreAddressController } from './store-address.controller';
import { StoreAddressService } from './store-address.service';

describe('StoreAddressController', () => {
  let controller: StoreAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreAddressController],
      providers: [StoreAddressService],
    }).compile();

    controller = module.get<StoreAddressController>(StoreAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
