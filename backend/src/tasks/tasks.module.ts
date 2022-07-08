import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Task } from './entity/task.entity';
import { TasksController } from './tasks.controller';
import { TasksMiddleware } from './tasks.middleware';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    JwtModule.register({ secret: process.env.JWT_KEY || 'secret'})
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(TasksMiddleware)
        .forRoutes('task')
  }
}
