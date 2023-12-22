import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  taskTitle: string;

  @IsOptional()
  @IsString()
  taskDescription: string;

  @IsOptional()
  @IsDate()
  taskDueDate: Date;
}
