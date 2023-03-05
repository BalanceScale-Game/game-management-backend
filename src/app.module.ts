import { Module, MiddlewareConsumer } from '@nestjs/common';
import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import { GameModule } from './modules/game/game.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // MongoDB
        MONGO_USERNAME: Joi.string().optional(),
        MONGO_PASSWORD: Joi.string().optional(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),

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
    AuthModule,
    UsersModule,
    GameModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
