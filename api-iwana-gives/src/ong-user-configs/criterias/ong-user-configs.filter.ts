import { Filter } from '@digichanges/shared-experience';

export class OngUserConfigFilter extends Filter {
    static readonly ONG: string = 'ong_id';
    static readonly USER: string = 'user_id';

    getFields(): string[] {
        return [OngUserConfigFilter.ONG, OngUserConfigFilter.USER];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
