import { ConflictException, Injectable } from '@nestjs/common';
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

    async getProjectByProjectId(projectId: string) {
        let projectRecord = await this.projectEntityRepository.findOne({ _id: projectId});
        return projectRecord;
    }

    async createProject(userId: string, projectName: string, projectDescription: string) {

        // Create a regular expression for case-insensitive matching of projectName
        const projectNameRegex = new RegExp(`^${projectName}$`, 'i');
    
        // Check if a project with the same name already exists (case-insensitive)
        const existingProject = await this.projectEntityRepository.findOne({
            projectName: { $regex: projectNameRegex }
        });
    
        // If a project with the same name exists, throw an error
        if (existingProject) {
            throw new ConflictException('Project with this name already exists');
        }
        
       
        // Create and return the new project
        return await this.projectEntityRepository.create({
            userId,
            projectName,
            projectDescription
        });
    }
    

}
