import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
    ClassSerializerInterceptor,
    HttpStatus,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Validation Pipes
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

    // Global prefix
    app.setGlobalPrefix('api');

    // Enable cors
    // app.enableCors();

    // Server port
    const config = app.get(ConfigService);
    const port = config.get('port');

    await app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`server running in port ${port}`);
    });
}
bootstrap();
