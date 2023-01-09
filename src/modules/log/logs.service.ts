import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/createLog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from 'src/models/log.model';

@Injectable()
export default class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.logModel.create(log);
    await newLog.save();
    return newLog;
  }
}
