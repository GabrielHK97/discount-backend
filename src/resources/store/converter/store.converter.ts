import { PersonalDataStoreAddressDto } from "src/resources/store-address/dto/personal-data-store-address.dto";
import { PersonalDataStoreDto } from "../dto/personal-data-store.dto";
import { Store } from "../entities/store.entity";

export class StoreConverter {
    static StoretoPersonalDataStoreDto(store: Store) {
        const dto = new PersonalDataStoreDto();
        dto.username = store.username;
        dto.cnpj = store.cnpj;
        dto.email = store.email;
        dto.phone = store.phone;
        dto.fantasyName = store.fantasyName;
        dto.realName = store.realName;
        dto.address = new PersonalDataStoreAddressDto();
        dto.address.place = store.address.place;
        dto.address.number = store.address.number;
        dto.address.complement = store.address.complement;
        dto.address.zipCode = store.address.zipCode;
        dto.address.city = store.address.city;
        dto.address.state = store.address.state;
        dto.address.neighborhood = store.address.neighborhood;
        return dto;
    }
}