import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserEntityDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(UserEntity.name)
        private userEntityRepository: Model<UserEntityDocument>) {

    }

    async createUserIfNotExist(email: string, firstName: string, lastName: string) {
        this.userEntityRepository.findOne()
    }

}
