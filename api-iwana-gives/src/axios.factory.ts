import axios, { AxiosInstance } from 'axios';

const headersPublic = {
    'Content-Type': 'application/json',
    Accept: '*/*',
};

const headersPrivate = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    Authorization: '',
};

export default class AxiosFactory {
    static getAxiosInstance(baseURL: string, authorization = null, timeout = 3000): AxiosInstance {
        let config: any;

        if (!authorization) {
            config = { baseURL, timeout, headers: headersPublic };
        } else {
            headersPrivate.Authorization = authorization;
            config = { baseURL, timeout, headers: headersPrivate };
        }

        return axios.create(config);
    }
}
