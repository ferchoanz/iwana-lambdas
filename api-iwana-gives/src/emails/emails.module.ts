import { forwardRef, Module } from '@nestjs/common';
import { UserAmountDonateModule } from 'src/user-amount-donate/user-amount-donate.module';
import { EmailApi } from './api/email.api';
import { EmailsService } from './emails.service';

@Module({
    imports: [forwardRef(() => UserAmountDonateModule)],
    providers: [EmailApi, EmailsService],
    exports: [EmailsService],
})
export class EmailsModule {}
