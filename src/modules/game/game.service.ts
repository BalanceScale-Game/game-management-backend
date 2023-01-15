import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

// Model
import { GameRoom, GameRoomDocument } from 'src/models';

// Utils
import { sleep } from 'src/utils/sleep';

@Injectable()
@UseFilters(AllExceptionsFilter)
export class GameService {
  constructor(
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoomDocument>,
  ) {}

  async createGameRoom(userId: string): Promise<GameRoom> {
    let roomId, room: GameRoom;
    const roomData = {
      game: 'K ro',
      createdBy: userId,
    };

    try {
      roomId = Math.floor(Math.random() * 1000);
      room = await this.gameRoomModel.create({
        _id: 'k_' + roomId,
        ...roomData,
      });
    } catch {
      await sleep(1000);
      roomId = Math.floor(Math.random() * 1000);
      room = await this.gameRoomModel.create({
        _id: 'k_' + roomId,
        ...roomData,
      });
    }

    return room;
  }
}
