import { Sort } from '@digichanges/shared-experience';

export class UserAmountDonateSort extends Sort {
    static readonly CREATED_AT: string = 'created_at';
    static readonly ID: string = 'id';
    static readonly UPDATED_AT: string = 'updated_at';
    static readonly PERCENT: string = 'percent';
    static readonly IS_ACTIVE: string = 'is_active';

    getFields() {
        return [
            UserAmountDonateSort.CREATED_AT,
            UserAmountDonateSort.ID,
            UserAmountDonateSort.UPDATED_AT,
            UserAmountDonateSort.PERCENT,
            UserAmountDonateSort.IS_ACTIVE,
        ];
    }

    getDefaultSorts() {
        return [{ [UserAmountDonateSort.UPDATED_AT]: 'DESC' }];
    }
}
