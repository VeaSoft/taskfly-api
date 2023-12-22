import { IsNotEmpty, IsString, IsDate, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  taskTitle: string;

  @IsString()
  taskDescription: string;

  @IsDate()
  taskDueDate: Date;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}
