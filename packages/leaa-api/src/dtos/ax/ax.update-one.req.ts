import { IsOptional } from 'class-validator';
import { Attachment } from '@leaa/api/src/entrys';

export class AxUpdateOneReq {
  @IsOptional()
  title?: string;

  @IsOptional()
  slug?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  attachments?: Attachment[];
}
