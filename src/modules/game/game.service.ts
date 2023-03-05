import { Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

// Model
import { GameRoom, GameRoomDocument } from 'src/models';

// Utils
import { sleep } from 'src/utils/sleep';
import { UsersService } from '../user/users.service';
import { Game, GameDocument } from 'src/models/game.model';
import { CreateGameDto } from './dto/createGame.dto';

@Injectable()
@UseFilters(AllExceptionsFilter)
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoomDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createGame(gameData: CreateGameDto): Promise<Game> {
    const { name, description, rule } = gameData;

    const game = new this.gameModel({
      name,
      description,
      rule,
    });
    game.save();

    return game;
  }

  async getGames(): Promise<Game[]> {
    const games = await this.gameModel.find();

    return games;
  }

  async createGameRoom(userId: string): Promise<GameRoom> {
    let roomId, room;

    const roomData = {
      game: 'K ro',
      createdBy: userId,
    };

    try {
      roomId = Math.floor(Math.random() * 1000);
      room = new this.gameRoomModel({
        _id: 'k_' + roomId,
        ...roomData,
      });

      room.save();
    } catch {
      await sleep(1000);
      roomId = Math.floor(Math.random() * 1000);
      room = new this.gameRoomModel({
        _id: 'k_' + roomId,
        ...roomData,
      });
      room.save();
    }

    return room;
  }
}
