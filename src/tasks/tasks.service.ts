import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getAllTasks(
    getTasksFilterDto: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskByID(id: string, user: User): Promise<Task> {
    const task = this.taskRepository.findOne({ id: id, user: user });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({ id: id, user: user });
    if (!task) {
      throw new NotFoundException();
    }

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
