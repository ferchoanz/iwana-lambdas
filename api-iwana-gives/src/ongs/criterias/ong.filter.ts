import { Filter } from '@digichanges/shared-experience';

export class OngFilter extends Filter {
    static readonly NAME: string = 'name';
    static readonly BRAND: string = 'brand';
    static readonly CATEGORY: string = 'ong_category_id';
    static readonly IS_ACTIVE: string = 'is_active';

    getFields(): string[] {
        return [OngFilter.NAME, OngFilter.BRAND, OngFilter.CATEGORY, OngFilter.IS_ACTIVE];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
