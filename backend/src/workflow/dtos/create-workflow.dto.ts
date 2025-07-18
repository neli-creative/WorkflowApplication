import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkflowNodeDto {
  @IsString()
  id: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsObject()
  condition?: Record<string, string>;

  @IsOptional()
  @IsString()
  next?: string;
}

export class CreateWorkflowDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowNodeDto)
  nodes: WorkflowNodeDto[];
}
