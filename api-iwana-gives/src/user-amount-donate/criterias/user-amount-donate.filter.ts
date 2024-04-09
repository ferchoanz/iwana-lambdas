import { Filter } from '@digichanges/shared-experience';

export class UserAmountDonateFilter extends Filter {
    static readonly PERCENT: string = 'percent';
    static readonly USER: string = 'user_id';
    static readonly IS_ACTIVE: string = 'is_active';
    static readonly SEARCH: string = 'search';
    static readonly ONG: string = 'ong_id';

    getFields(): string[] {
        return [
            UserAmountDonateFilter.PERCENT,
            UserAmountDonateFilter.USER,
            UserAmountDonateFilter.IS_ACTIVE,
            UserAmountDonateFilter.SEARCH,
            UserAmountDonateFilter.ONG,
        ];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
