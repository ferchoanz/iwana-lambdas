import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { OngCategorySort } from './ong-category.sort';
import { OngCategoryFilter } from './ong-category.filter';

export class ListOngCategoryDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new OngCategorySort(query), new OngCategoryFilter(query), new Pagination(query, url));
    }
}
