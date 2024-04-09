import {
    ClassSerializerInterceptor,
    HttpStatus,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            validationError: {
                target: false,
            },
            exceptionFactory: (errors: ValidationError[]) => {
                const e = errors.map((error) => {
                    const tmp = {};
                    tmp[error.property] = [];
                    const keys = Object.keys(error.constraints);
                    keys.forEach((key) => {
                        tmp[error.property].push(error.constraints[key]);
                    });
                    return tmp;
                });
                return new UnprocessableEntityException(e);
            },
        }),
    );

    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    });

    app.setGlobalPrefix('api');

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
