import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { OngUserConfigSort } from './ong-user-configs.sort';
import { OngUserConfigFilter } from './ong-user-configs.filter';

export class ListOngUserConfigDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new OngUserConfigSort(query), new OngUserConfigFilter(query), new Pagination(query, url));
    }
}
