import { AddressEntity } from "src/utils/entities/address-entity";
import { Entity } from "typeorm";

@Entity()
export class PersonAddress  extends AddressEntity{
}
