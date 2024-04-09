import { UserAmountDonate } from 'src/user-amount-donate/entities/user-amount-donate.entity';

export class CreateUserAmountDonateHistoryDto {
    userAmountDonate: UserAmountDonate;

    percent: number;
}
