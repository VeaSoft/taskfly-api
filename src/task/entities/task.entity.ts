import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskEntityDocument = HydratedDocument<TaskEntity>;

@Schema({ timestamps: true })
export class TaskEntity {

    _id: Types.ObjectId;

    @Prop({ required: true })
    taskTitle: string;

    @Prop()
    taskDescription: string;

    @Prop({})
    taskDueDate: Date;

    @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectEntity' })
    projectId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' }) // Reference to UserEntity
    userId: Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt?: Date;

    @Prop({ default: Date.now })
    updatedAt?: Date;
}

export const TaskEntitySchema = SchemaFactory.createForClass(TaskEntity);
