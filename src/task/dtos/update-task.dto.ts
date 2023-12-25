import { IsOptional, IsString, IsDate, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  taskTitle: string;

  @IsOptional()
  @IsString()
  taskDescription: string;

  @IsOptional()
  @IsDateString()
  taskDueDate: string;
}
