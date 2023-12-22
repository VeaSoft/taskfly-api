// create-project.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {

  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsString()
  projectDescription: string;
}
