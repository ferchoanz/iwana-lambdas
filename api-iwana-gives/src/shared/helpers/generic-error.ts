import { HttpException } from '@nestjs/common';

export class GenericError {
    private statusCode: number;
    private message: string;
    private error: string;

    static throw(statusCode = 500, message?: string, error?: string) {
        throw new HttpException(
            {
                statusCode,
                message: message ?? 'Internal server error',
                error: error ?? 'Server Error',
            },
            statusCode,
        );
    }
}
