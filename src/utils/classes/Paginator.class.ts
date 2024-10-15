import { SortDirection } from "typeorm";

export class Paginator {
    page?: number;
    pageSize?: number;
    sort?: string;
    direction: SortDirection
}