import { PersonalDataStoreAddressDto } from "src/resources/store-address/dto/personal-data-store-address.dto";

export class PersonalDataStoreDto {
    id: string;
    username: string;
    realName: string;
    fantasyName: string;
    cnpj: string;
    email: string;
    phone: string;
    address: PersonalDataStoreAddressDto
}