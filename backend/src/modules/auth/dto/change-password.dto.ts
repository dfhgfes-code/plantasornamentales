import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña actual' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Nueva contraseña (mín. 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50)
  newPassword: string;
}
