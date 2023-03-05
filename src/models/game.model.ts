import { Exclude, Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  rule: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
