import { Injectable, Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User, UserDocument } from 'src/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from 'src/models/role.model';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

// Entity

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,

    @InjectModel(User.name) private userModel: Model<UserDocument>,

    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async seed() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      // Delete all role
      await this.roleModel.remove();
      // Detele all user
      await this.userModel.remove();

      // Create new role
      const role1 = await this.roleModel.create({});
      role1.name = 'admin';
      const role2 = await this.roleModel.create({});
      role2.name = 'member';
      const role3 = await this.roleModel.create({});
      role3.name = 'systemadmin';
      const roles = await Promise.all([
        role1.save(),
        role2.save(),
        role3.save(),
      ]);
      this.logger.debug('Successfuly completed seeding roles...');

      // Create new user
      const users = [];
      const hashedPassword = await bcrypt.hash('123456', 10);
      roles.forEach(async (role) => {
        const user = await this.userModel.create({});

        user.name = faker.name.findName();
        user.email = faker.internet.email();
        user.roles = [role];
        user.password = hashedPassword;

        users.push(user.save());
      });

      await Promise.all(users);

      this.logger.debug('Successfuly completed seeding users...');
    } catch (error) {
      this.logger.error('Failed seeding users...');
    }
  }
}
