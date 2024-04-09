import { Sort } from '@digichanges/shared-experience';

export class OngUserConfigSort extends Sort {
    static readonly CREATED_AT: string = 'created_at';

    getFields() {
        return [OngUserConfigSort.CREATED_AT];
    }

    getDefaultSorts() {
        return [{ [OngUserConfigSort.CREATED_AT]: 'ASC' }];
    }
}
