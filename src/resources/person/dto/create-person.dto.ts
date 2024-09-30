import { CreatePersonAddressDto } from "src/resources/person-address/dto/create-person-address.dto";
import { SexEnum } from "src/utils/enums/sex.enum";

export class CreatePersonDto {
    name: string;
    cpf: string;
    birthDate: string;
    sex: SexEnum;
    email: string;
    phone: string;
    address: CreatePersonAddressDto;
}
