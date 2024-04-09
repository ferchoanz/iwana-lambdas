import { Sort } from '@digichanges/shared-experience';

export class OngPaymentSort extends Sort {
    static readonly CREATED_AT: string = 'created_at';
    static readonly UPDATED_AT: string = 'updated_at';
    static readonly ONG_NAME: string = 'o.name';
    static readonly ID: string = 'id';
    static readonly STATE_NAME: string = 'ops.name';

    getFields() {
        return [
            OngPaymentSort.CREATED_AT,
            OngPaymentSort.UPDATED_AT,
            OngPaymentSort.ONG_NAME,
            OngPaymentSort.ID,
            OngPaymentSort.STATE_NAME,
        ];
    }

    getDefaultSorts() {
        return [{ [OngPaymentSort.UPDATED_AT]: 'DESC' }];
    }
}
