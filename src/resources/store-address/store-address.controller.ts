import { Controller } from '@nestjs/common';
import { StoreAddressService } from './store-address.service';

@Controller('store-address')
export class StoreAddressController {
  constructor(private readonly storeAddressService: StoreAddressService) {}
}
