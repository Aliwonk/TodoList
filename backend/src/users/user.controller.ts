import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { EmptyData, ErrorAuthUser, ErrorCreateUser, NotFoundUser, SuccesfullyAuthUser, SuccesfullyCreateUser } from './types/response';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({ type: SuccesfullyCreateUser, description: 'После регистрация создается токен с данными пользователя ' })
    @ApiBadRequestResponse({ type: ErrorCreateUser, description: 'Отправляет ответ о существовании пользователя или о некоректных данных' })
    @ApiNotFoundResponse({ type: EmptyData, description: 'Ошибка валидации - один из данных пользователя пустой'})
    @Post('register')
    registerUser(@Res() response: Response, @Body() userData: CreateUserDto) {
        return this.userService.createUser(response, userData); 
    }

    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiBody({type: AuthUserDto})
    @ApiOkResponse({ type: SuccesfullyAuthUser, description: 'Пользователь успешно зарегистирирован. Создается токен с данными пользователя' })
    @ApiNotFoundResponse({ type: ErrorAuthUser, description: 'Пользователь не найден. Неверный пароль или логин' })
    @ApiBadRequestResponse({ type: EmptyData, description: 'Отсутвует данные для авторизации' })
    @Post('auth')
    authorizationUser(@Res() response: Response, @Body() userData: AuthUserDto) {
        return this.userService.authUser(response, userData);
    }
    
    @ApiOperation({ summary: 'Получение всех пользователя' })
    @ApiOkResponse({ type: [User] })
    @Get('all')
    getUsers() {
        return this.userService.getUsers();
    }

    @ApiOperation({ summary: 'Получение одного пользователя' })
    @ApiParam({ example: '1', name: 'id', description: 'id пользователя'})
    @ApiNotFoundResponse({ type: NotFoundUser })
    @ApiOkResponse({ type: User })
    @Get(':id')
    getUser(@Res() response: Response, @Param('id') id: number) {
        
        return this.userService.getUser(response, id);
    }

}
