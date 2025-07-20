import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { JwtPayload, UserInRequest } from '../types/auth.types';

declare module 'express' {
  interface Request {
    user?: UserInRequest;
    userId?: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log('Token reçu:', token);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      const user = await this.authService.findUserById(payload.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = {
        userId: payload.userId,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      request.userId = payload.userId;
    } catch (e) {
      Logger.error((e as Error).message);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
