import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';

export interface Response<T> {
    data: T;
}

@Injectable()
export class ListInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const ResponseObj: ExpressResponse = context.switchToHttp().getResponse();
        ResponseObj.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        ResponseObj.setHeader('Access-Control-Allow-Origin', '*');
        ResponseObj.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT');

        return next.handle().pipe(
            map((data) => ({
                statusCode: 0,
                message: 'Success',
                ...data,
            })),
        );
    }
}
