import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({ description: 'Token de acceso proporcionado por Google' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
