import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from './role.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  @ApiProperty()
  public email: string;

  @Prop()
  @ApiProperty()
  public name: string;

  @Prop()
  @Exclude()
  public password: string;

  @Prop({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name }],
  })
  @Type(() => Role)
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
