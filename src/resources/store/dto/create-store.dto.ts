import { CreatePersonDto } from "src/resources/person/dto/create-person.dto";
import { CreateStoreAddressDto } from "src/resources/store-address/dto/create-store-address.dto";

export class CreateStoreDto {
    username: string;
    password: string;
    confirmPassword: string;
    realName: string;
    fantasyName: string;
    cnpj: string;
    address: CreateStoreAddressDto
    person: CreatePersonDto
}