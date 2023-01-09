import { Module } from '@nestjs/common';
import CustomLogger from './customLogger';
import { ConfigModule } from '@nestjs/config';
import LogsService from './logs.service';
import { Log, LogSchema } from 'src/models/log.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
