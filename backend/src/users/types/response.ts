import { ApiProperty } from "@nestjs/swagger";

export class ErrorCreateUser{
    @ApiProperty({ example: 'Пользователь существует', description: 'Ошибка о существонании пользователя' })
    readonly error: string
}

export class SuccesfullyCreateUser{
    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ', description: 'Токен пользователя, его нужно сохранить в куки под именем userToken для доступа к другим данным'})
    readonly token: string
    @ApiProperty({ example: 'Пользователь создан', description: 'Успешная регистрация пользователя' })
    readonly message: string
}

export class EmptyData{
    @ApiProperty({ example: 'Пустые данные', description: 'Ошибка о пустых данные пользователя' })
    readonly error: string
}


export class SuccesfullyAuthUser{
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ', description: 'Токен пользователя, его нужно сохранить в куки под именем userToken для доступа к другим данным'})
    readonly token: string
    @ApiProperty({ example: 'Авторизация успешно', description: 'Успешная авторизация' })
    readonly message: string
}

export class ErrorAuthUser{
    @ApiProperty({ example: 'Неверный логин или пароль', description: 'Невозможно найти пользователя в базе данных'})
    readonly error: string
}

export class NotFoundUser {
    @ApiProperty({ example: 'Пользователь не найден', description: 'Пользователь не найден в базе данных' })
    readonly error: string
}