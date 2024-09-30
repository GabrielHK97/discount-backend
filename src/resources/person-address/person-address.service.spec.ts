import { Test, TestingModule } from '@nestjs/testing';
import { PersonAddressService } from './person-address.service';

describe('PersonAddressService', () => {
  let service: PersonAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonAddressService],
    }).compile();

    service = module.get<PersonAddressService>(PersonAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
