import { Module } from '@nestjs/common';
import { OngUserConfigHistoriesService } from './ong-user-config-histories.service';
import { OngUserConfigHistoriesController } from './ong-user-config-histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngUserConfigHistory } from './entities/ong-user-config-history.entity';
import { OngUserConfigHistoryRepository } from './repositories/ong-user-config-history.repository';

@Module({
    imports: [TypeOrmModule.forFeature([OngUserConfigHistory])],
    controllers: [OngUserConfigHistoriesController],
    providers: [OngUserConfigHistoriesService, OngUserConfigHistoryRepository],
    exports: [OngUserConfigHistoriesService],
})
export class OngUserConfigHistoriesModule {}
