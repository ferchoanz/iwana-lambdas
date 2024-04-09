import { ICriteria } from '@digichanges/shared-experience';
import { Injectable } from '@nestjs/common';
import { isUndefined } from 'lodash';
import { OngCategoriesService } from 'src/ong-categories/services/ong-categories.service';
import { DesactivateDonationsService } from 'src/user-amount-donate/services/desactivate-donations.service';
import { CreateOngDto } from '../dto/create-ong.dto';
import { UpdateOngDto } from '../dto/update-ong.dto';
import { Ong } from '../entities/ong.entity';
import { OngRepository } from '../repositories/ong.repository';

@Injectable()
export class OngsAdminService {
    constructor(
        private readonly ongRepository: OngRepository,
        private readonly ongCategoryService: OngCategoriesService,
        private readonly desactiveDonationsSerivice: DesactivateDonationsService,
    ) {}

    async save(data: CreateOngDto): Promise<Ong> {
        data.ong_category_id = await this.ongCategoryService.findOne(data.ong_category_id as number);
        return await this.ongRepository.saveOng(data);
    }

    async update(id: number, data: UpdateOngDto): Promise<Ong> {
        if (!isUndefined(data.ong_category_id)) {
            data.ong_category_id = await this.ongCategoryService.findOne(data.ong_category_id as number);
        }
        const ong: Ong = await this.ongRepository.updateOng({ where: { id } }, data);

        if (!ong.is_active) {
            // Desactive UserAmountDonate
            await this.desactiveDonationsSerivice.desactiveDonations(ong.id);
        }

        return ong;
    }

    async findOne(id: number): Promise<Ong> {
        const ong: Ong = await this.ongRepository.findOneOng({ where: { id }, relations: ['ongCategory'] });

        //------- temporary fix---------///
        Object.assign(ong, { ong_category_id: ong.ongCategory.id });

        delete ong.ongCategory;
        //-----------------------------//

        return ong;
    }

    async findAll(criteria: ICriteria): Promise<any> {
        return await this.ongRepository.findOngsAdmin(criteria);
    }

    async softDelete(id: number): Promise<Ong> {
        return await this.ongRepository.softDeleteOng({ where: { id } });
    }

    async findOngWithDonates(criteria: ICriteria): Promise<any> {
        return await this.ongRepository.findOngWithDonates(criteria);
    }
}
