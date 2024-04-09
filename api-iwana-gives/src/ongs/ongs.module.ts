import { Module } from '@nestjs/common';
import { OngsService } from './services/ongs.service';
import { OngsController } from './controllers/ongs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ong } from './entities/ong.entity';
import { OngRepository } from './repositories/ong.repository';
import { OngsAdminService } from './services/ongs-admin.service';
import { OngsAdminController } from './controllers/ongs-admin.controller';
import { OngCategoriesModule } from 'src/ong-categories/ong-categories.module';
import { UserAmountDonateModule } from 'src/user-amount-donate/user-amount-donate.module';

@Module({
    imports: [TypeOrmModule.forFeature([Ong]), OngCategoriesModule, UserAmountDonateModule],
    controllers: [OngsController, OngsAdminController],
    providers: [OngsService, OngRepository, OngsAdminService],
    exports: [OngsService],
})
export class OngsModule {}
