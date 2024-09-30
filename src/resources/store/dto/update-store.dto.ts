import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';

export class UpdatePersonAddressDto extends PartialType(CreateStoreDto) {}