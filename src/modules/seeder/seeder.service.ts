import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

// Entity
import Role from 'src/entities/role.entity';
import User from 'src/entities/user.entity';
import Address from 'src/entities/address.entity';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) {}

  async seed() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      // Delete all role
      await this.roleRepo.delete({});
      // Delete all address
      await this.addressRepo.delete({});
      // Detele all user
      await this.userRepo.delete({});

      // Create new role
      const role1 = new Role();
      role1.name = 'admin';
      const role2 = new Role();
      role2.name = 'member';
      const role3 = new Role();
      role3.name = 'systemadmin';
      const roles = await Promise.all([
        this.roleRepo.save(role1),
        this.roleRepo.save(role2),
        this.roleRepo.save(role3),
      ]);
      this.logger.debug('Successfuly completed seeding roles...');

      // Create new user
      const users = [];
      const hashedPassword = await bcrypt.hash('123456', 10);
      roles.forEach((role) => {
        const user = new User();

        user.name = faker.name.findName();
        user.email = faker.internet.email();
        user.roles = [role];
        user.password = hashedPassword;
        user.address = null;

        users.push(this.userRepo.save(user));
      });

      await Promise.all(users);

      this.logger.debug('Successfuly completed seeding users...');
    } catch (error) {
      this.logger.error('Failed seeding users...');
    }
  }
}
