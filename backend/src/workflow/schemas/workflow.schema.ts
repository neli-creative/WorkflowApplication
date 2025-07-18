import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkflowDocument = Workflow & Document;

export interface WorkflowNode {
  id: string;
  prompt: string;
  condition?: Record<string, string>;
  next?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Workflow {
  @Prop({ type: [Object], required: true })
  nodes: WorkflowNode[];
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
