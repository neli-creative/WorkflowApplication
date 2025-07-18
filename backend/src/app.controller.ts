import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Role } from './auth/enums/role.enum';
import { AuthGuard } from './auth/guards/auth.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(@CurrentUser() user: any) {
    return {
      message: 'Hello World',
      user: {
        userId: user.userId,
      },
    };
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'Admin only data',
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('user')
  @Roles(Role.USER, Role.ADMIN)
  getUserData(@CurrentUser() user: any) {
    return {
      message: 'User data (accessible by USER and ADMIN)',
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }
}
