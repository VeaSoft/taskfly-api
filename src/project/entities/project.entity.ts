import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectEntityDocument = HydratedDocument<ProjectEntity>;

@Schema({ timestamps: true })
export class ProjectEntity {

    
    @Prop()
    projectName: string;

    @Prop()
    projectDescription: string;

    @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
    userId: Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const ProjectEntitySchema = SchemaFactory.createForClass(ProjectEntity);
