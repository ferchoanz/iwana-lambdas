import { Filter } from '@digichanges/shared-experience';

export class OngUserConfigHistoryFilter extends Filter {
    static readonly ONG_USER_CONFIG: string = 'ong_user_config_id';
    static readonly PERCENT: string = 'percent';

    getFields(): string[] {
        return [OngUserConfigHistoryFilter.ONG_USER_CONFIG, OngUserConfigHistoryFilter.PERCENT];
    }

    getDefaultFilters(): any[] {
        return [];
    }
}
