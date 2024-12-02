import { UUID } from "crypto";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({type: "date"})
    createdAtDate: Date;

    @Column({type: "timestamp"})
    createdAtDateTime: Date;
    
    @Column({type: "date"})
    updatedAtDate: Date;

    @Column({type: "timestamp"})
    updatedAtDateTime: Date;

    @Column({type: "date"})
    removedAtDate: Date;
    
    @Column({type: "timestamp"})
    removedAtDateTime: Date;
}