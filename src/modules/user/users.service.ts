import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { Model } from 'mongoose';
import { Role, RoleDocument, Roles } from 'src/models/role.model';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.userModel.findOne({ where: { id } });
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

  public async updateUserById(userId: number, userData: UpdateUserDto) {
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

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
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
