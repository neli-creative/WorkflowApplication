import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsString({ message: 'First name must be a string.' })
  firstName: string;

  @IsString({ message: 'Last name must be a string.' })
  lastName: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either user or admin.' })
  role?: Role;
}
