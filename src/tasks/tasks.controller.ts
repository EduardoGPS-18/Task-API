import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get('')
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return await this.taskService.getAllTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" retrieving task with id: ${id}`,
    );
    return await this.taskService.getTaskByID(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.taskService.createTask(createTaskDto, user);
    this.logger.verbose(
      `User "${user.username}" create task with id: ${task.id}`,
    );
    return task;
  }

  @Delete('/:taskId')
  async deleteTask(
    @Param('taskId') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`User "${user.username}" delete task with id: ${id}`);
    await this.taskService.deleteTask(id, user);
  }

  @Patch('/:taskId')
  async updateTaskStatus(
    @Param('taskId') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" update task with id: ${id} to ${status} status`,
    );
    return await this.taskService.updateTaskStatus(id, status, user);
  }
}
