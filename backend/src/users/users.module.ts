import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: process.env.JWT_KEY || 'secret', })
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UsersModule {}
