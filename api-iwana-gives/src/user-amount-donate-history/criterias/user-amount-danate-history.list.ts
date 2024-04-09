import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { UserAmountDonateHistorySort } from './user-amount-donate-history.sort';
import { UserAmountDonateHistoryFilter } from './user-amount-donate-history.filter';

export class ListUserAmountDonateHistoryDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(
            new UserAmountDonateHistorySort(query),
            new UserAmountDonateHistoryFilter(query),
            new Pagination(query, url),
        );
    }
}
