import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../../entities/user.entity';
import { UsersController } from './users.controller';
import Address from 'src/entities/address.entity';
import Role from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Role])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
