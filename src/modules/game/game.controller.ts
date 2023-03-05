import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Service
import { GameService } from './game.service';

// Model
import { GameRoom } from 'src/models';

// Dto
import { CreateRoomDto } from './dto';

import MongooseClassSerializerInterceptor from 'src/configs/interceptors/mongooseClassSerializer.interceptor';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';
import { Game } from 'src/models/game.model';
import JwtAuthGuard from '../auth/guard/jwtAuth.guard';
import { CreateGameDto } from './dto/createGame.dto';

@Controller('game')
@UseInterceptors(MongooseClassSerializerInterceptor(GameRoom))
@UseInterceptors(MongooseClassSerializerInterceptor(Game))
@UseFilters(AllExceptionsFilter)
@ApiTags('Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @MessagePattern('create.room')
  async createGameRoom(@Payload() message: CreateRoomDto) {
    const gameRoom = await this.gameService.createGameRoom(message.userId);
    return gameRoom;
  }

  @Get('/')
  async getGames(@Req() req) {
    const games = await this.gameService.getGames();

    return games;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createGame(@Req() req, @Body() gameData: CreateGameDto) {
    const game = await this.gameService.createGame(gameData);

    return game;
  }
}
