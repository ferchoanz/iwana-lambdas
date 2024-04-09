import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, AxiosResponse } from 'axios';
import AxiosFactory from 'src/axios.factory';
import { GenericError } from 'src/shared/helpers/generic-error';

@Injectable()
export class EmailApi {
    private api: AxiosInstance;

    constructor(private config: ConfigService) {
        const token = `Bearer ${config.get('api.sendgrid.token')}`;
        this.api = AxiosFactory.getAxiosInstance(config.get('api.sendgrid.baseUrl'), token, 10000);
    }

    async sendEmail(data: any): Promise<any> {
        let email: AxiosResponse<{ data: any }>;

        try {
            email = await this.api.post('mail/send', data);
        } catch (error) {
            console.log(error);
            GenericError.throw();
        }

        return email.data.data;
    }
}
