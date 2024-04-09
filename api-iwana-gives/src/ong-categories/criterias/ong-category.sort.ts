import { Sort } from '@digichanges/shared-experience';

export class OngCategorySort extends Sort {
    static readonly ID: string = 'id';
    static readonly NAME: string = 'name';
    static readonly CREATED_AT: string = 'created_at';
    static readonly UPDATED_AT: string = 'updated_at';

    getFields() {
        return [OngCategorySort.NAME, OngCategorySort.CREATED_AT, OngCategorySort.UPDATED_AT, OngCategorySort.ID];
    }

    getDefaultSorts() {
        return [{ [OngCategorySort.CREATED_AT]: 'DESC' }];
    }
}
