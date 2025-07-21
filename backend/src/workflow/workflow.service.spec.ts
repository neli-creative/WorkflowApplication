import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { getModelToken } from '@nestjs/mongoose';
import { Workflow } from './schemas/workflow.schema';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { RunWorkflowDto } from './dtos/run-workflow.dto';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WorkflowService', () => {
  let service: WorkflowService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let workflowModel: Model<Workflow>;

  const mockWorkflowModel = {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const createAxiosResponse = <T>(data: T) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      url: 'http://test-url.com',
      method: 'post',
    },
    request: {},
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: getModelToken(Workflow.name),
          useValue: mockWorkflowModel,
        },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    workflowModel = module.get<Model<Workflow>>(getModelToken(Workflow.name));

    // Mock environment variables
    process.env.OPEN_API_URL = 'https://api.openai.com/v1/chat/completions';
    process.env.IA_PROMPT = 'You are a helpful assistant.';
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkflow', () => {
    const validWorkflowDto: CreateWorkflowDto = {
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

    it('should create a valid workflow successfully', async () => {
      mockWorkflowModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
      mockWorkflowModel.create.mockResolvedValue(validWorkflowDto);

      await service.createWorkflow(validWorkflowDto);

      expect(mockWorkflowModel.deleteMany).toHaveBeenCalledWith({});
      expect(mockWorkflowModel.create).toHaveBeenCalledWith(validWorkflowDto);
    });

    it('should throw error if start node is missing', async () => {
      const invalidDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'notstart',
            prompt: 'Hello {{input}}',
          },
        ],
      };

      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        "Missing entry point: 'start' node",
      );
    });

    it('should throw error for invalid variables in prompt', async () => {
      const invalidDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{invalidVar}}',
          },
        ],
      };

      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        "Invalid variable(s) in prompt of node 'start': invalidVar",
      );
    });

    it('should throw error if node has both next and condition', async () => {
      const invalidDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'end',
            condition: { yes: 'end' },
          },
        ],
      };

      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        "Node 'start' must not have both 'next' and 'condition'",
      );
    });

    it('should throw error if next node does not exist', async () => {
      const invalidDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'nonexistent',
          },
        ],
      };

      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        "Node 'start' references unknown next node 'nonexistent'",
      );
    });

    it('should throw error if condition references unknown node', async () => {
      const invalidDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            condition: { yes: 'nonexistent' },
          },
        ],
      };

      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(invalidDto)).rejects.toThrow(
        "Node 'start' condition key 'yes' references unknown node 'nonexistent'",
      );
    });

    it('should throw error if cycle is detected', async () => {
      const cyclicDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'middle',
          },
          {
            id: 'middle',
            prompt: 'Process {{lastOutput}}',
            next: 'start',
          },
        ],
      };

      await expect(service.createWorkflow(cyclicDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createWorkflow(cyclicDto)).rejects.toThrow(
        'Cycle detected in workflow graph',
      );
    });

    it('should accept valid workflow with conditions', async () => {
      const validConditionDto: CreateWorkflowDto = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            condition: { yes: 'positive', no: 'negative' },
          },
          {
            id: 'positive',
            prompt: 'Positive response {{lastOutput}}',
          },
          {
            id: 'negative',
            prompt: 'Negative response {{lastOutput}}',
          },
        ],
      };

      mockWorkflowModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
      mockWorkflowModel.create.mockResolvedValue(validConditionDto);

      await service.createWorkflow(validConditionDto);

      expect(mockWorkflowModel.create).toHaveBeenCalledWith(validConditionDto);
    });
  });

  describe('runWorkflow', () => {
    const runDto: RunWorkflowDto = {
      input: 'test input',
    };

    const mockWorkflow = {
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
      createdAt: new Date(),
      _id: 'mockId',
    };

    beforeEach(() => {
      mockedAxios.post.mockResolvedValue(
        createAxiosResponse({
          choices: [{ message: { content: 'AI response' } }],
        }),
      );
    });

    it('should run workflow successfully', async () => {
      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockWorkflow),
      });

      const result = await service.runWorkflow(runDto);

      expect(mockWorkflowModel.findOne).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ result: 'AI response' });
    });

    it('should throw error if no workflow exists', async () => {
      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'No workflow has been created yet',
      );
    });

    it('should throw error if start node is missing', async () => {
      const workflowWithoutStart = {
        nodes: [
          {
            id: 'notstart',
            prompt: 'Hello {{input}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(workflowWithoutStart),
      });

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'Invalid or missing start node',
      );
    });

    it('should throw error if start node does not have input variable', async () => {
      const workflowWithInvalidStart = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello world',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(workflowWithInvalidStart),
      });

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'Invalid or missing start node',
      );
    });

    it('should handle workflow with conditions', async () => {
      const conditionalWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            condition: { yes: 'positive' },
          },
          {
            id: 'positive',
            prompt: 'Positive {{lastOutput}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(conditionalWorkflow),
      });

      mockedAxios.post
        .mockResolvedValueOnce(
          createAxiosResponse({
            choices: [{ message: { content: 'yes' } }],
          }),
        )
        .mockResolvedValueOnce(
          createAxiosResponse({
            choices: [{ message: { content: 'final response' } }],
          }),
        );

      const result = await service.runWorkflow(runDto);

      expect(result).toEqual({ result: 'final response' });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });

    it('should throw error for unexpected condition output', async () => {
      const conditionalWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            condition: { yes: 'positive' },
          },
          {
            id: 'positive',
            prompt: 'Positive {{lastOutput}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(conditionalWorkflow),
      });

      mockedAxios.post.mockResolvedValue(
        createAxiosResponse({
          choices: [{ message: { content: 'maybe' } }],
        }),
      );

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'Unexpected condition output "maybe" at node start',
      );
    });

    it('should throw error if next node is not found', async () => {
      const invalidWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'missing',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(invalidWorkflow),
      });

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'Node with id "missing" not found',
      );
    });

    it('should detect runtime cycles', async () => {
      const workflowWithPotentialCycle = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
            next: 'start',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(workflowWithPotentialCycle),
      });

      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow(runDto)).rejects.toThrow(
        'Cycle detected at node "start"',
      );
    });

    it('should make correct OpenAI API calls', async () => {
      const singleNodeWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(singleNodeWorkflow),
      });

      await service.runWorkflow(runDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4.1',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            { role: 'user', content: 'Hello test input' },
          ],
        },
        {
          headers: {
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });

  describe('getWorkflow', () => {
    it('should return the latest workflow', async () => {
      const mockWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockWorkflow),
      });

      const result = await service.getWorkflow();

      expect(mockWorkflowModel.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockWorkflow);
    });

    it('should throw error if no workflow found', async () => {
      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getWorkflow()).rejects.toThrow(BadRequestException);
      await expect(service.getWorkflow()).rejects.toThrow('No workflow found');
    });
  });

  describe('private methods validation', () => {
    it('should validate prompts correctly during execution', async () => {
      const invalidWorkflow = {
        nodes: [
          {
            id: 'start',
            prompt: 'Hello {{input}} and {{invalid}}',
          },
        ],
        createdAt: new Date(),
        _id: 'mockId',
      };

      mockWorkflowModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(invalidWorkflow),
      });

      await expect(service.runWorkflow({ input: 'test' })).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.runWorkflow({ input: 'test' })).rejects.toThrow(
        'Invalid variables in prompt for node start',
      );
    });
  });
});
