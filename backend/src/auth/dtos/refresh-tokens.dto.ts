import { IsString } from 'class-validator';

export class RefreshTokensDto {
  @IsString({ message: 'Refresh token must be a string.' })
  token: string;
}
