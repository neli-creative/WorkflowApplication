import { IsString } from 'class-validator';

export class RunWorkflowDto {
  @IsString()
  input: string;
}
