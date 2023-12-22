import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectEntity, ProjectEntitySchema } from './entities/project.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [MongooseModule.forFeature([
    { name: ProjectEntity.name, schema: ProjectEntitySchema },
  ]), AuthModule]
})
export class ProjectModule {}
