import { Injectable } from '@nestjs/common';
import { OngUserConfigsService } from 'src/ong-user-configs/ong-user-configs.service';
import { UserAmountDonateAdminService } from 'src/user-amount-donate/services/user-amount-donate-admin.service';

@Injectable()
export class DesactivateDonationsService {
    constructor(
        private readonly oucService: OngUserConfigsService,
        private readonly uadService: UserAmountDonateAdminService,
    ) {}

    async desactiveDonations(ongId: number): Promise<any> {
        const ids: number[] = await this.oucService.getIdsFromAllToPay(ongId);

        await this.uadService.desactiveDonations(ids);
    }
}
