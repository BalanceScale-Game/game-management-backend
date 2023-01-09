import * as Joi from '@hapi/joi';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Address from 'src/entities/address.entity';
import Role from 'src/entities/role.entity';
import User from 'src/entities/user.entity';
import { DatabaseModule } from '../database/database.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // PostgresQL
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        // Port server
        PORT: Joi.number(),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Role, Address]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
