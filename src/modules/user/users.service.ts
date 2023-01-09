import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Address from 'src/entities/address.entity';
import Role, { Roles } from 'src/entities/role.entity';
import { In, Repository } from 'typeorm';
import User from '../../entities/user.entity';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Address)
    private addresesRepository: Repository<Address>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
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
    const user = await this.usersRepository.findOne({ where: { id } });
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

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = password;

    let roleEntities = [];
    if (roles.length > 0) {
      roleEntities = await this.roleRepository.find({
        where: {
          name: In(roles),
        },
      });
    } else {
      const role = await this.roleRepository.find({
        where: {
          name: Roles.MEMBER,
        },
      });
      roleEntities.push(role);
    }

    newUser.roles = roleEntities;

    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    let user = await this.getById(userId);

    if (!user.address?.id) {
      const address = await this.addresesRepository.save(userData.address);
      await this.usersRepository.update(
        {
          id: userId,
        },
        {
          address: address,
        },
      );
      user = await this.getById(userId);
    } else {
      await this.addresesRepository.update(
        { id: user.address.id },
        userData.address,
      );
    }

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
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
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
