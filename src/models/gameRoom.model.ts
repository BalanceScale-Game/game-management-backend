import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from './user.model';

export type GameRoomDocument = GameRoom & Document;
@Schema({ timestamps: true, _id: false })
export class GameRoom {
  @Transform(({ value }) => value.toString())
  @Prop()
  _id: string;

  @Prop()
  public game: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  @Type(() => User)
  public createdBy: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);
