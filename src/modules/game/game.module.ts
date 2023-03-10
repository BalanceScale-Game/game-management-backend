import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Model
import { GameRoom, GameRoomSchema, User, UserSchema } from 'src/models';

// Service
import { GameService } from './game.service';

// Controller
import { GameController } from './game.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: GameRoom.name, schema: GameRoomSchema },
    ]),
  ],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
