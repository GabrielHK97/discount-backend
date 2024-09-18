import { Test, TestingModule } from '@nestjs/testing';
import { StoreAddressService } from './store-address.service';

describe('StoreAddressService', () => {
  let service: StoreAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreAddressService],
    }).compile();

    service = module.get<StoreAddressService>(StoreAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
