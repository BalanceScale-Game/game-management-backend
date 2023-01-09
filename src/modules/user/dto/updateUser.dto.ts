import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class AddressDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  public street: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public country: string;
}

export class UpdateUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty()
  address: AddressDto;
}

export default UpdateUserDto;
