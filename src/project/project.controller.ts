import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Request } from 'express';


@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProjectsBelongingToUser(@Req() req: Request) {
    const userId = req.user._id; // Assuming userId is available in the user object from JWT
    return {data: await this.projectService.getProjectsBelongingToUser(userId), message: `successfully retrieved projects`};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId')
  async getProjectByProjectId(@Param('projectId') projectId: string) {
    return {data: await this.projectService.getProjectByProjectId(projectId), message: `successfully retrieved project`};
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const userId = req.user._id; // Assuming userId is available in the user object from JWT
    
    const { projectName, projectDescription } = createProjectDto;
    return {data: await this.projectService.createProject(userId, projectName, projectDescription), message: 'successfully created project'};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count/user')
  async getProjectCountForUser(@Req() req: Request) {
    const userId = req.user._id; // Assuming userId is available in the user object from JWT
    const count = await this.projectService.getProjectCountForUser(userId);
    return { count, message: 'Successfully retrieved project count for user' };
  }
}
