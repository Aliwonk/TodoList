import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';
import { TasksService } from './tasks.service';
import { EmptyDataCreateTask, ErrorUpdateTask, ForbiddenCreateTask, NotFoundGetTask, NotFoundResponsibleCreateTask, SuccesfullyCreateTask, SuccesfullyUpdateTask, UnauthorizedCreateTask } from './types/response';

@ApiTags('Tasks')
@ApiHeader({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibG9naW4iOiJhbGV4QG1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NTcyMjA3MzAsImV4cCI6MTY1NzMwNzEzMH0.HAauSyM47ImkB6VUiVOeKXReO3wH2Ex1is0EGNfxnWw',
    name: 'Authorization',
    description: 'Токен пользователя'
})
@Controller('task')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @ApiOperation({ summary: 'Создание задачи' })
    @ApiBody({ type: CreateTaskDto })
    @ApiCreatedResponse({ type: SuccesfullyCreateTask })
    @ApiBadRequestResponse({ type: EmptyDataCreateTask })
    @ApiUnauthorizedResponse({ type: UnauthorizedCreateTask })
    @ApiNotFoundResponse({ type: NotFoundResponsibleCreateTask })
    @ApiForbiddenResponse({ type: ForbiddenCreateTask })
    @Post('create')
    createTask(@Req() request: Request, @Res() response: Response, @Body() data: CreateTaskDto) {
        return this.tasksService.createTask(request, response, data);
    }
    

    @ApiOperation({ summary: 'Обновление задачи' })
    @ApiBody({ type: CreateTaskDto })
    @ApiOkResponse({ type: SuccesfullyUpdateTask })
    @ApiInternalServerErrorResponse({ type: ErrorUpdateTask })
    @Post('update/:id')
    updateTask(@Req() request: Request, @Res() response: Response, @Param('id') id: number, @Body() taskData: CreateTaskDto) {
        return this.tasksService.updateTask(request, response, id, taskData);
    }

    @ApiOperation({ summary: 'Получение всех задач конкретного пользователя' })
    @ApiOkResponse({ type: [Task] })
    @Get('all')
    getTasks(@Req() request: Request, @Query() query: any) {
        return this.tasksService.getTasks(request, query);
    }

    @ApiOperation({ summary: 'Получение всех задач' })
    @ApiOkResponse({ type: [Task] })
    @Get('tasks')
    getAllTasks() {
        return this.tasksService.getAllTasks();
    }

    @ApiOperation({ summary: 'Получение одной задачи' })
    @ApiOkResponse({ type: Task })
    @ApiNotFoundResponse({ type: NotFoundGetTask })
    @Get(':id')
    getTask(@Res() response: Response, @Param('id') id: number, @Query() query: any) {
        return this.tasksService.getTask(response, id, query);
    }

}
