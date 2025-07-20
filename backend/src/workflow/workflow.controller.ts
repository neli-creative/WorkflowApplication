import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RunWorkflowDto } from './dtos/run-workflow.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('create')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  async create(@Body() workflowDto: CreateWorkflowDto): Promise<void> {
    await this.workflowService.createWorkflow(workflowDto);
  }

  @Post('run')
  @Roles(Role.ADMIN, Role.USER)
  async runWorkflow(@Body() runWorkflowDto: RunWorkflowDto) {
    try {
      return await this.workflowService.runWorkflow(runWorkflowDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async getWorkflow() {
    try {
      return await this.workflowService.getWorkflow();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
