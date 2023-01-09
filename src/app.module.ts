import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import { ProductModule } from './modules/product/product.module';

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
    AuthModule,
    UsersModule,
    ProductModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
