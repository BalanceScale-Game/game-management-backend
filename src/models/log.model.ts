import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;
@Schema({ timestamps: true })
export class Log {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ nullable: true })
  public context: string;

  @Prop()
  public message: string;

  @Prop()
  public level: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
