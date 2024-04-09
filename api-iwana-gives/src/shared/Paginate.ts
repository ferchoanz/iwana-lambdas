import { IPaginator, PaginatorTransformer } from '@digichanges/shared-experience';

export class Paginate {
    private paginator: IPaginator;

    constructor(paginator: IPaginator) {
        this.paginator = paginator;
    }

    async paginate(): Promise<any> {
        const data = await this.paginator.paginate();
        const metadata = this.paginator.getMetadata();
        const result = { data, metadata: metadata ?? undefined };

        if (this.paginator.getExist()) {
            const paginatorTransformer = new PaginatorTransformer();
            this.paginator = await paginatorTransformer.handle(this.paginator);

            const pagination = { pagination: this.paginator };

            Object.assign(result, pagination);
        }

        return result;
    }
}
