import { ICriteria } from '@digichanges/shared-experience';
import { Pagination } from 'src/shared/Pagination';
import { RequestCriteria } from 'src/shared/RequestCriteria';
import { ParsedQs } from 'qs';
import { OngPaymentSort } from './ong-payment.sort';
import { OngPaymentFilter } from './ong-payment.filter';

export class ListOngPaymentDto extends RequestCriteria implements ICriteria {
    constructor(query: ParsedQs, url: string) {
        super(new OngPaymentSort(query), new OngPaymentFilter(query), new Pagination(query, url));
    }
}
