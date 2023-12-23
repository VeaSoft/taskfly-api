import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskEntity, TaskEntitySchema } from './entities/task.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [MongooseModule.forFeature([{ name: TaskEntity.name, schema: TaskEntitySchema }]), ProjectModule]
})
export class TaskModule {}
