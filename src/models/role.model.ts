import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
  SYSTEMADMIN = 'systemadmin',
}
export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    enum: Roles,
    default: Roles.MEMBER,
    unique: true,
  })
  public name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
