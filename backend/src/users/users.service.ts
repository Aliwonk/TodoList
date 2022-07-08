import { HttpStatus, Injectable, Res, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { Response } from 'express';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    // DATA FROM .ENV

    // salt for bcrypt
    private readonly bcryptSalt = Number(process.env.BCRYPT_SALT)

    // VALIDATE USER DATA

    private async validateData(data: CreateUserDto | AuthUserDto) {
        const dataValidate = Object.values(data);
        
        // check all data on empty

        for (let i = 0; i < dataValidate.length; i++) {
            if(dataValidate[i] === '') { 
                return { error: 'Пустые данные' }
            }
        }

        // validate login

        const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        const validateLogin = emailRegexp.test(data.login);
        if(!validateLogin) return { error: 'Неправлиьный логин' };

        // validate password

        if(data.password.length < 4) return { error: 'Короткий пароль' };

    }


    // CREATE USER

    async createUser(@Res() response: Response, userData: CreateUserDto) {

        // validate data

        const validate = await this.validateData(userData)
        if(validate) {
            
            // send erro valdate data

            return response
            .writeHead(
                HttpStatus.BAD_REQUEST,
                { 'Content-Type': 'application/json' }
            ).end(JSON.stringify(
                { error: validate.error }
            ));
        }

        // checking if a user exists

        const checkLoginUser = await this.usersRepository.findOne({ where: { login: userData.login } });
        
        if(checkLoginUser) {

            // send error

            return response
            .writeHead(
                HttpStatus.BAD_REQUEST, 
                { 'Content-Type':'application/json' }
            ).end(JSON.stringify(
                { error: 'Пользователь существует' }
            ));

        }else {

            // save data user

            const user = new User();
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.patronymic = userData.patronymic;
            user.login = userData.login;
            user.role = userData.role;

            // hash password

            user.password = await bcrypt.hash(userData.password, this.bcryptSalt);

            // create token

            const result = await this.usersRepository.save(user);
            const payload = {id: user.id, login: result.login, role: result.role };

            const token = this.jwtService.sign(payload, {expiresIn: '1d'});
            // send response successfuly create user

            return response
            .writeHead(
                HttpStatus.CREATED,
                { 'Content-Type': 'application/json' }
            ).end(JSON.stringify(
                { 
                    token,
                    message: 'Пользователь создан'
                }
            ));
        }
        
    }


    // AUTHORIZATION USER

    async authUser(@Res() response: Response, userData: AuthUserDto) {

        // validate data

        const validate = await this.validateData(userData);
        if(validate) {

            // send erro valdate data

            return response
            .writeHead(
                HttpStatus.BAD_REQUEST,
                { 'Content-Type': 'application/json' }
            ).end(JSON.stringify(
                { error: validate.error }
            ));
        }
        
        // get user data 

        const user = await this.usersRepository.findOne({ where: { login: userData.login } });
        

        // check user

        if(!user) {

            // send error: user not found

            return response
            .writeHead(
                HttpStatus.NOT_FOUND,
                { 'Content-Type': 'application/json' }
            ).end(JSON.stringify(
                { error: 'Пользователь не найден' }
            ));

        }else {

            // check password
            const checkPass = await bcrypt.compare(userData.password, user.password);
            
            if(!checkPass) {

                // send error: incorrect password

                return response
                .writeHead(
                    HttpStatus.BAD_REQUEST,
                    { 'Content-Type': 'application/json' }
                ).end(JSON.stringify(
                    { error: 'Неверный логин или пароль' }
                ));

            } else {


                // create token

                const payload = { id: user.id, login: user.login, role: user.role };
                const token = this.jwtService.sign(payload, { expiresIn: '1d' });

                // send succesfully auth
                
                return response
                .writeHead(
                    HttpStatus.OK,
                    { 'Content-Type': 'application/json' }
                ).end(JSON.stringify(
                    {
                        token,
                        message: 'Авторизация успешно'
                    }
                ));

            }

        }
    }

    // GET ONE USER
    
    async getUser(@Res() response: Response, idUser: number) {
        const user = await this.usersRepository.findOneBy({ id: idUser });

        // check a user exists 

        if(!user){
             
            return response
            .writeHead(
                HttpStatus.NOT_FOUND,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify({ error: 'Пользователь не найден' }))
        }else {

            return response
            .writeHead(
                HttpStatus.OK,
                {'Content-Type': 'application/json'}
            ).end(JSON.stringify(user))
        }
    }

    // GET ALL USERS

    async getUsers() {
        const users = await this.usersRepository.find();

        return users;
    }
}
