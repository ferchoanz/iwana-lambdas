import { Sort } from '@digichanges/shared-experience';

export class OngUserConfigHistorySort extends Sort {
    static readonly CREATED_AT: string = 'created_at';
    static readonly UPDATED_AT: string = 'updated_at';
    static readonly PERCENT: string = 'percent';

    getFields() {
        return [
            OngUserConfigHistorySort.CREATED_AT,
            OngUserConfigHistorySort.UPDATED_AT,
            OngUserConfigHistorySort.PERCENT,
        ];
    }

    getDefaultSorts() {
        return [{ [OngUserConfigHistorySort.CREATED_AT]: 'DESC' }];
    }
}
