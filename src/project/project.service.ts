import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectEntity, ProjectEntityDocument } from './entities/project.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {

    constructor(@InjectModel(ProjectEntity.name) private projectEntityRepository: Model<ProjectEntityDocument>) {

    }


    async getProjectsBelongingToUser(userId: string){
        return await this.projectEntityRepository.find({userId});
    }

    async getProjectByProjectName(projectName: string) {
        let projectRecord = await this.projectEntityRepository.findOne({ projectName: { $regex: new RegExp(projectName.trim(), 'i') } });
        return projectRecord;
    }

    async createProject(userId: string, projectName: string, projectDescription: string) {
       return await this.projectEntityRepository.create({userId, projectName, projectDescription});
    }

}
