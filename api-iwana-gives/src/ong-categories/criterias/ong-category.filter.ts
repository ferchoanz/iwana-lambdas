import { Filter } from '@digichanges/shared-experience';

export class OngCategoryFilter extends Filter {
    static readonly NAME: string = 'name';

    getFields(): string[] {
        return [OngCategoryFilter.NAME];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
