import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserEntityDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(UserEntity.name)
        private userEntityRepository: Model<UserEntityDocument>, 
        private jwtService: JwtService) {

    }

    async createUserIfNotExist(email: string, firstName: string, lastName: string): Promise<UserEntityDocument | null> {

        const userWithEmail = await this.userEntityRepository.findOneAndUpdate(
            { email: { $regex: new RegExp(email, 'i') } },
            { $set: { email, firstName, lastName } },
            { upsert: true, new: true }
        );

        return userWithEmail;
    }

    async getUserByEmail(email: string): Promise<UserEntityDocument | null> {
        return await this.userEntityRepository.findOne({ email: email });
    }

    async getJwtForUser(userId: string): Promise<string> {
        const payload = { userId: userId };
        const token = this.jwtService.sign(payload);
        return token;
    }
}
