import { Controller, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
