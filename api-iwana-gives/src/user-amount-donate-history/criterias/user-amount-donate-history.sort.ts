import { Sort } from '@digichanges/shared-experience';

export class UserAmountDonateHistorySort extends Sort {
    static readonly CREATED_AT: string = 'created_at';
    static readonly UPDATED_AT: string = 'updated_at';
    static readonly PERCENT: string = 'percent';
    static readonly RESERVED: string = 'reserved';

    getFields() {
        return [
            UserAmountDonateHistorySort.CREATED_AT,
            UserAmountDonateHistorySort.UPDATED_AT,
            UserAmountDonateHistorySort.PERCENT,
            UserAmountDonateHistorySort.RESERVED,
        ];
    }

    getDefaultSorts() {
        return [{ [UserAmountDonateHistorySort.CREATED_AT]: 'DESC' }];
    }
}
