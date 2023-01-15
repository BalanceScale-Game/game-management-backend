import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserFromTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
