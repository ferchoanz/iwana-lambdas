import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) {}

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneUser({ where: { id } });
    }

    async validateIfExistInPayment(userId: number): Promise<boolean> {
        const user: User = await this.userRepository.inPayment(userId);

        return user ? true : false;
    }
}
