import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { OngSort } from './ong.sort';
import { OngFilter } from './ong.filter';

export class ListOngDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new OngSort(query), new OngFilter(query), new Pagination(query, url));
    }
}
