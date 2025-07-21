import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { RunWorkflowDto } from './dtos/run-workflow.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';

describe('WorkflowController', () => {
  let controller: WorkflowController;
  let workflowService: WorkflowService;

  const mockWorkflowService = {
    createWorkflow: jest.fn(),
    runWorkflow: jest.fn(),
    getWorkflow: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        {
          provide: WorkflowService,
          useValue: mockWorkflowService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<WorkflowController>(WorkflowController);
    workflowService = module.get<WorkflowService>(WorkflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createWorkflowDto: CreateWorkflowDto = {
      nodes: [
        {
          id: 'start',
          prompt: 'Hello {{input}}',
          next: 'end',
        },
        {
          id: 'end',
          prompt: 'Process {{lastOutput}}',
        },
      ],
    };

    it('should create a workflow successfully', async () => {
      mockWorkflowService.createWorkflow.mockResolvedValue(undefined);

      const result = await controller.create(createWorkflowDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(workflowService.createWorkflow).toHaveBeenCalledWith(
        createWorkflowDto,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(workflowService.createWorkflow).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should propagate service errors', async () => {
      const error = new BadRequestException('Invalid workflow');
      mockWorkflowService.createWorkflow.mockRejectedValue(error);

      await expect(controller.create(createWorkflowDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('runWorkflow', () => {
    const runWorkflowDto: RunWorkflowDto = {
      input: 'test input',
    };

    it('should run workflow successfully', async () => {
      const expectedResult = { result: 'workflow output' };
      mockWorkflowService.runWorkflow.mockResolvedValue(expectedResult);

      const result = await controller.runWorkflow(runWorkflowDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(workflowService.runWorkflow).toHaveBeenCalledWith(runWorkflowDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(workflowService.runWorkflow).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors and throw HttpException', async () => {
      const serviceError = new BadRequestException('Workflow error');
      mockWorkflowService.runWorkflow.mockRejectedValue(serviceError);

      await expect(controller.runWorkflow(runWorkflowDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.runWorkflow(runWorkflowDto)).rejects.toThrow(
        'Workflow error',
      );
    });

    it('should handle generic errors with INTERNAL_SERVER_ERROR status', async () => {
      const genericError = new Error('Generic error');
      mockWorkflowService.runWorkflow.mockRejectedValue(genericError);

      try {
        await controller.runWorkflow(runWorkflowDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect((error as HttpException).message).toBe('Generic error');
      }
    });

    it('should preserve error status when available', async () => {
      const errorWithStatus = {
        message: 'Custom error',
        status: HttpStatus.BAD_REQUEST,
      };
      mockWorkflowService.runWorkflow.mockRejectedValue(errorWithStatus);

      try {
        await controller.runWorkflow(runWorkflowDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect((error as HttpException).message).toBe('Custom error');
      }
    });
  });

  describe('getWorkflow', () => {
    it('should get workflow successfully', async () => {
      const mockWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'end',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockWorkflowService.getWorkflow.mockResolvedValue(mockWorkflow);

      const result = await controller.getWorkflow();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(workflowService.getWorkflow).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWorkflow);
    });

    it('should handle service errors and throw HttpException', async () => {
      const serviceError = new BadRequestException('No workflow found');
      mockWorkflowService.getWorkflow.mockRejectedValue(serviceError);

      await expect(controller.getWorkflow()).rejects.toThrow(HttpException);
      await expect(controller.getWorkflow()).rejects.toThrow(
        'No workflow found',
      );
    });

    it('should handle generic errors with INTERNAL_SERVER_ERROR status', async () => {
      const genericError = new Error('Database error');
      mockWorkflowService.getWorkflow.mockRejectedValue(genericError);

      try {
        await controller.getWorkflow();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect((error as HttpException).message).toBe('Database error');
      }
    });
  });
});
