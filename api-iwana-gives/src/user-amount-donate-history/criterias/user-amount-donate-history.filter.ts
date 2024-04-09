import { Filter } from '@digichanges/shared-experience';

export class UserAmountDonateHistoryFilter extends Filter {
    static readonly PERCENT: string = 'percent';
    static readonly RESERVED: string = 'reserved';

    getFields(): string[] {
        return [UserAmountDonateHistoryFilter.PERCENT, UserAmountDonateHistoryFilter.RESERVED];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
