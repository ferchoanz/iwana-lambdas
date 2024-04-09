import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, AxiosResponse } from 'axios';
import AxiosFactory from 'src/axios.factory';
import { GenericError } from 'src/shared/helpers/generic-error';
import { IBalanceRespose } from './iwana-cash-response.interface';

@Injectable()
export class IwanaCashApi {
    private api: AxiosInstance;

    constructor(private config: ConfigService) {
        this.api = AxiosFactory.getAxiosInstance(config.get('api.iwanaCash.baseUrl'), null, 10000);
    }

    async getBalance(params: any): Promise<IBalanceRespose> {
        let balance: AxiosResponse<{ data: IBalanceRespose }>;

        try {
            balance = await this.api.get('my-account/balance', { params });
        } catch (error) {
            GenericError.throw();
        }

        return balance.data.data;
    }
}
