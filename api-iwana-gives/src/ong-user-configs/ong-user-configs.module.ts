import { forwardRef, Module } from '@nestjs/common';
import { OngUserConfigsService } from './ong-user-configs.service';
import { OngUserConfigsController } from './ong-user-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OngUserConfig } from './entities/ong-user-config.entity';
import { OngUserConfigRepository } from './repositories/ong-user-config.repository';
import { OngsModule } from 'src/ongs/ongs.module';
import { UsersModule } from 'src/users/users.module';
import { OngUserConfigHistoriesModule } from 'src/ong-user-config-histories/ong-user-config-histories.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([OngUserConfig]),
        forwardRef(() => OngsModule),
        UsersModule,
        OngUserConfigHistoriesModule,
        EmailsModule,
    ],
    controllers: [OngUserConfigsController],
    providers: [OngUserConfigsService, OngUserConfigRepository],
    exports: [OngUserConfigsService],
})
export class OngUserConfigsModule {}
