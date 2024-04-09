import { Injectable } from '@nestjs/common';
import { OngUserConfig } from 'src/ong-user-configs/entities/ong-user-config.entity';
import { UserAmountDonateService } from 'src/user-amount-donate/services/user-amount-donate.service';
import { User } from 'src/users/user.entity';
import { EmailApi } from './api/email.api';

@Injectable()
export class EmailsService {
    constructor(private readonly emailApi: EmailApi, private readonly uadService: UserAmountDonateService) {}

    async sendEmail(user: User, oucArray: OngUserConfig[]): Promise<any> {
        const subject = 'Hemos registrado tu selección para donar. ¡Gracias!';
        const percent = (await this.uadService.findOneByUser(user.id)).percent;
        const templateId = 'd-ec525f511710497a9a26cc9dcf518951';
        let ongs = '';

        oucArray.forEach((ouch) => {
            ongs += `${ouch.ong.name}, `;
        });

        ongs = ongs.slice(0, ongs.length - 2); // Remove the last two characters of the string

        const data = {
            from: {
                email: 'notificaciones@iwanacash.com',
            },
            personalizations: [
                {
                    to: [
                        {
                            email: user.email,
                        },
                    ],
                    dynamic_template_data: {
                        subject: subject,
                        percent: percent,
                        ongs,
                        userName: user.name,
                    },
                },
            ],
            template_id: templateId,
        };

        const email = await this.emailApi.sendEmail(data);

        return { message: 'email sent successfully' };
    }
}
