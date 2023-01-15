import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Service
import { GameService } from './game.service';

// Model
import { GameRoom } from 'src/models';

// Dto
import { CreateRoomDto } from './dto';

import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';

@Controller('game')
@UseInterceptors(MongooseClassSerializerInterceptor(GameRoom))
@UseFilters(AllExceptionsFilter)
@ApiTags('Game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @MessagePattern('create.room')
  async createGameRoom(@Payload() message: CreateRoomDto) {
    const gameRoom = await this.gameService.createGameRoom(message.userId);
    return gameRoom;
  }
}
