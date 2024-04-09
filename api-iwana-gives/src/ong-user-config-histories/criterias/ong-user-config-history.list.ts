import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { OngUserConfigHistorySort } from './ong-user-config-history.sort';
import { OngUserConfigHistoryFilter } from './ong-user-config-history.filter';

export class ListOngUserConfigHistoryDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new OngUserConfigHistorySort(query), new OngUserConfigHistoryFilter(query), new Pagination(query, url));
    }
}
