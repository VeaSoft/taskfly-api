import { IsNotEmpty, IsString, IsDate, IsUUID, IsDateString, Validate } from 'class-validator';
import { IsValidObjectId } from 'src/validator-extensions/is-object-id.validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  taskTitle: string;

  @IsString()
  taskDescription: string;

  @IsDateString()
  taskDueDate: string;

  @IsNotEmpty()
  @Validate(IsValidObjectId)
  projectId: string;
}
