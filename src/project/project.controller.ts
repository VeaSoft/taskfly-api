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
    const userId = req.user.userId; // Assuming userId is available in the user object from JWT
    return this.projectService.getProjectsBelongingToUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectName')
  async getProjectByProjectName(@Param('projectName') projectName: string) {
    return this.projectService.getProjectByProjectName(projectName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const userId = req.user.userId; // Assuming userId is available in the user object from JWT
    
    const { projectName, projectDescription } = createProjectDto;
    return this.projectService.createProject(userId, projectName, projectDescription);
  }
}
