import { Sort } from '@digichanges/shared-experience';

export class OngSort extends Sort {
    static readonly NAME: string = 'name';
    static readonly CREATED_AT: string = 'created_at';
    static readonly ID: string = 'id';
    static readonly UPDATED_AT: string = 'updated_at';

    getFields() {
        return [OngSort.NAME, OngSort.CREATED_AT, OngSort.ID, OngSort.UPDATED_AT];
    }

    getDefaultSorts() {
        return [{ [OngSort.CREATED_AT]: 'DESC' }];
    }
}
