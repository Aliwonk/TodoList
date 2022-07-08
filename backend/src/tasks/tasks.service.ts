import { HttpStatus, Injectable, Query, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    // VALIDATE DATA
    
    private async validateData(data: CreateTaskDto) {
        const dataValidate = Object.values(data);
        
        // check all data on empty

        for (let i = 0; i < dataValidate.length; i++) {
            if(dataValidate[i] === '') { 
                return { error: 'Пустые данные' }
            }
        }

    }

    // CREATE TASK

    async createTask(@Req() request: Request, @Res() response: Response, taskData: CreateTaskDto) {
        
        // validate data

        const validate = await this.validateData(taskData);

        if(validate)  {
            return response
            .writeHead(
                HttpStatus.BAD_REQUEST,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify(
                { error: validate.error }
            ));
        }

        // get token
        
        const token = request.cookies.userToken;
        const decodeToken: any = this.jwtService.verify(token);

        // check role user

        const userRole = decodeToken.role;

        if(userRole !== 'manager') {
            return response
            .writeHead(
                HttpStatus.FORBIDDEN,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify(
                { error: 'Пользователь не имеет прав' }
            ));
        }

        // save data task
        
        const task = new Task();
        task.caption = taskData.caption;
        task.description = taskData.description;
        task.endDate = taskData.endDate;
        task.priority = taskData.priority;
        task.status = taskData.status;
        
        // get id creator from token
        
        const idCreator = decodeToken.id;

        const creator = await this.usersRepository.find({ where: { id: idCreator }});

        // save creator

        task.creator = creator;

        // get user responsible
        
        const user = await this.usersRepository.findOneBy({ id: taskData.responsible });
        

        // check user

        if(!user) {
            return response
            .writeHead(
                HttpStatus.NOT_FOUND,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify({ error: 'Не найден, ответсвенный за задачу, пользователь' }));
        }

        // save responsible
        
        task.responsible = [user];

        // save task in database 

        const createTask = await this.tasksRepository.save(task);

        if(!createTask) {

        // send error create task

            return response
            .writeHead(
                HttpStatus.INTERNAL_SERVER_ERROR,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify({ error: 'Ошибка создания' }))
        }else {
        
        // send succesfully сreate task

         // save task in user

            user.tasks = [createTask];

            this.usersRepository.save(user);

            return response
            .writeHead(
                HttpStatus.OK,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify({ mesage: 'Задача создана' }))

        }
    }

    // UPDATE TASK

    async updateTask(@Req() request: Request, @Res() response: Response, idTask: number, taskData: CreateTaskDto) {
        
        // update task by id

        const taskLoaded = await this.tasksRepository.findOneBy({ id: idTask });


        // send error not found task 

        if(!taskLoaded) return response
                .writeHead(
                    HttpStatus.NOT_FOUND,
                    {'Content-Type': 'application/json'}
                ).end(JSON.stringify({ error: 'Задача не найдена' }))

        
        // check role user

        // get token

        const token = request.cookies.userToken;
        const decodeToken: any = this.jwtService.verify(token);
        
        // update task for user

        if (decodeToken.role === 'user') {
            
            taskLoaded.status = taskData.status

            const update = await this.tasksRepository.save(taskLoaded);

            // send succesfully update task

            if(update) {
            
                return response
                .writeHead(
                    HttpStatus.OK,
                    {'Content-Type': 'application/json'}
                ).end(JSON.stringify({ message: 'Обновление успешно' }))
            
            }else {

            // send error update task 

                return response
                .writeHead(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    {'Content-Type': 'application/json'}
                ).end(JSON.stringify({ error: 'Невозможно обновить задачу' }))

            }

        } else {
        
        // update task for manager
            
            // get responsible task
            
            const responsibleId = taskData.responsible;
            const responsible = await this.usersRepository.findOneBy({ id: responsibleId });

            // change data task

            taskLoaded.caption = taskData.caption;
            taskLoaded.description = taskData.description;
            taskLoaded.endDate = taskData.endDate;
            taskLoaded.status = taskData.status
            taskLoaded.priority = taskData.priority;
            taskLoaded.responsible = [responsible];

            const update = await this.tasksRepository.save(taskLoaded);
            
            if(update) {
            
            // send succesfully update task

                return response
                .writeHead(
                    HttpStatus.OK,
                    {'Content-Type': 'application/json'}
                ).end(JSON.stringify({ message: 'Обновление успешно' }))
            
            }else {

            // send error update task

                return response
                .writeHead(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    {'Content-Type': 'application/json'}
                ).end(JSON.stringify({ error: 'Ошибка обновления задачи' }))

            }
        }
    }


    // GET TASK

    async getTask(response: Response, id: number, @Query() query: any) {
        
        // if query

        console.log(query);

        // get task

        const task = await this.tasksRepository.find({where: { id }, relations: { responsible: true, creator: true } });
        

        // check task

        if(!task) {
            
            // send error not found task
            
            return response
            .writeHead(
                HttpStatus.NOT_FOUND,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify({ error: 'Задача не найдена' }))
        
        }else {

            // send data task

            return response
            .writeHead(
                HttpStatus.OK,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify(task));
        
        }

    }


    // GET TASKS

    async getTasks(@Req() request: Request, @Query() query: any) {

        // get token
        
        console.log(query);

        const token = request.headers.authorization;
        const decodeToken: any = this.jwtService.verify(token, { maxAge: 24 * 60 * 60 * 1000 });
        const idUser = decodeToken.id;
        const roleUser = decodeToken.role;

        // get task

        const tasksUser: User[] = await this.usersRepository.find( { where: { id: idUser }, relations: { tasks: true } });

        return tasksUser[0].tasks;
    }   


    // GET ALL TASKS

    async getAllTasks() {
        
        const allTasks = this.tasksRepository.find({ relations: { creator: true, responsible: true } });

        return allTasks;

    }
}
