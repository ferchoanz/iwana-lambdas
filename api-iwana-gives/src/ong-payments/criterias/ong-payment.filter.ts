import { Filter } from '@digichanges/shared-experience';

export class OngPaymentFilter extends Filter {
    static readonly SEARCH: string = 'search';
    static readonly STATE: string = 'ong_payment_state_id';

    getFields(): string[] {
        return [OngPaymentFilter.SEARCH, OngPaymentFilter.STATE];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
