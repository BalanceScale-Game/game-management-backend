import {
  HttpException,
  HttpStatus,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

// Model
import { Role, RoleDocument, Roles, User, UserDocument } from 'src/models';

// Dto
import { CreateUserDto, UpdateUserDto } from './dto';

import { AllExceptionsFilter } from 'src/configs/decorators/catchError';
@Injectable()
@UseFilters(AllExceptionsFilter)
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel
      .findOne({
        email,
      })
      .populate('roles');
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).populate('roles');
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async createUser(userData: CreateUserDto) {
    const { email, name, password, roles } = userData;

    let roleEntities = [] as Role[];
    if (roles.length > 0) {
      roleEntities = await this.roleModel.find({
        name: { $in: roles },
      });
    } else {
      const role: Role[] = await this.roleModel.find(
        {
          name: Roles.MEMBER,
        },
        { _id: 1 },
      );
      roleEntities.push(role?.[0]);
    }

    const newUser = await this.userModel.create({
      name,
      email,
      password,
      roles: roleEntities,
    });

    return newUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async updateUserById(userId: string, userData: UpdateUserDto) {
    const user = await this.getById(userId);

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.updateOne(
      { _id: userId },
      {
        currentHashedRefreshToken,
      },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userModel.updateOne(
      { _id: userId },
      {
        currentHashedRefreshToken: null,
      },
    );
  }
}
