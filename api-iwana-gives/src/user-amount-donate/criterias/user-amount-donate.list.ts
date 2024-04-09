import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { UserAmountDonateSort } from './user-amount-donate.sort';
import { UserAmountDonateFilter } from './user-amount-donate.filter';

export class ListUserAmountDonateDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new UserAmountDonateSort(query), new UserAmountDonateFilter(query), new Pagination(query, url));
    }
}
