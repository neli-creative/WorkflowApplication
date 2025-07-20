import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workflow, WorkflowDocument } from './schemas/workflow.schema';
import { Model } from 'mongoose';
import { CreateWorkflowDto } from './dtos/create-workflow.dto';
import { RunWorkflowDto } from './dtos/run-workflow.dto';
import axios from 'axios';

interface WorkflowNode {
  id: string;
  prompt: string;
  next?: string;
  condition?: Record<string, string>;
}

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(Workflow.name)
    private readonly workflowModel: Model<WorkflowDocument>,
  ) {}

  async createWorkflow(dto: CreateWorkflowDto): Promise<void> {
    this.validateWorkflow(dto.nodes);

    await this.workflowModel.deleteMany({});
    await this.workflowModel.create(dto);
  }

  private validateWorkflow(nodes: CreateWorkflowDto['nodes']) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    if (!nodeMap.has('start')) {
      throw new BadRequestException(`Missing entry point: 'start' node`);
    }

    for (const node of nodes) {
      const { id, prompt, next, condition } = node;

      const invalidVars = [...prompt.matchAll(/{{(.*?)}}/g)]
        .map((m) => m[1])
        .filter((v) => !['input', 'lastOutput'].includes(v));
      if (invalidVars.length > 0) {
        throw new BadRequestException(
          `Invalid variable(s) in prompt of node '${id}': ${invalidVars.join(', ')}`,
        );
      }

      if (next && condition) {
        throw new BadRequestException(
          `Node '${id}' must not have both 'next' and 'condition'`,
        );
      }

      if (next && !nodeMap.has(next)) {
        throw new BadRequestException(
          `Node '${id}' references unknown next node '${next}'`,
        );
      }

      if (condition) {
        for (const [key, targetId] of Object.entries(condition)) {
          if (!nodeMap.has(targetId)) {
            throw new BadRequestException(
              `Node '${id}' condition key '${key}' references unknown node '${targetId}'`,
            );
          }
        }
      }
    }

    this.detectCycles(nodes);
  }

  private detectCycles(nodes: CreateWorkflowDto['nodes']) {
    const graph = new Map<string, string[]>();
    nodes.forEach((node) => {
      const targets = node.condition
        ? Object.values(node.condition)
        : node.next
          ? [node.next]
          : [];
      graph.set(node.id, targets);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      if (!graph.has(nodeId)) return false;
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      for (const neighbor of graph.get(nodeId)!) {
        if (dfs(neighbor)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    if (dfs('start')) {
      throw new BadRequestException(`Cycle detected in workflow graph`);
    }
  }

  async runWorkflow(dto: RunWorkflowDto) {
    const { input } = dto;

    const workflow = await this.workflowModel.findOne().sort({ createdAt: -1 });

    if (!workflow) {
      throw new BadRequestException('No workflow has been created yet');
    }

    const nodes = workflow.nodes;
    const startNode = nodes.find((n) => n.id === 'start');

    if (!startNode || !startNode.prompt.includes('{{input}}')) {
      throw new BadRequestException('Invalid or missing start node');
    }

    let currentNode: WorkflowNode | null = startNode;
    let lastOutput = '';
    const visitedNodes = new Set<string>();

    while (currentNode) {
      if (visitedNodes.has(currentNode.id)) {
        throw new BadRequestException(
          `Cycle detected at node "${currentNode.id}"`,
        );
      }
      visitedNodes.add(currentNode.id);

      const prompt = this.interpolate(currentNode.prompt, input, lastOutput);

      if (!this.isPromptValid(currentNode.prompt)) {
        throw new BadRequestException(
          `Invalid variables in prompt for node ${currentNode.id}`,
        );
      }

      const aiResponse = await this.callOpenAI(prompt);
      lastOutput = aiResponse;

      if (!currentNode.next && !currentNode.condition) {
        const startNode = nodes.find((n) => n.id === 'start');
        if (!startNode) {
          throw new BadRequestException('Missing start node for restart');
        }
      }

      if (currentNode.condition) {
        const nextId = currentNode.condition[lastOutput.trim()];
        if (!nextId) {
          throw new BadRequestException(
            `Unexpected condition output "${lastOutput}" at node ${currentNode.id}`,
          );
        }
        const nextNode: WorkflowNode | null =
          nodes.find((n) => n.id === nextId) ?? null;
        if (!nextNode) {
          throw new BadRequestException(`Node with id "${nextId}" not found`);
        }
        currentNode = nextNode;
      } else if (currentNode.next) {
        const nextNode = nodes.find((n) => n.id === currentNode!.next);
        if (!nextNode) {
          throw new BadRequestException(
            `Node with id "${currentNode.next}" not found`,
          );
        }
        currentNode = nextNode;
      } else {
        currentNode = null;
      }
    }

    return { result: lastOutput };
  }

  private interpolate(
    prompt: string,
    input: string,
    lastOutput: string,
  ): string {
    return prompt
      .replace('{{input}}', input)
      .replace('{{lastOutput}}', lastOutput);
  }

  private isPromptValid(prompt: string): boolean {
    const matches = prompt.match(/{{(.*?)}}/g);
    if (!matches) return true;
    return matches.every((m) => m === '{{input}}' || m === '{{lastOutput}}');
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await axios.post<OpenAIResponse>(
      process.env.OPEN_API_URL || 'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: process.env.IA_PROMPT || 'You are a helpful assistant.',
          },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.choices[0].message.content.trim();
  }

  async getWorkflow(): Promise<Workflow> {
    const workflow = await this.workflowModel.findOne().sort({ createdAt: -1 });

    if (!workflow) {
      throw new BadRequestException('No workflow found');
    }

    return workflow;
  }
}
