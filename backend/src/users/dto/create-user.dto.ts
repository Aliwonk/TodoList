import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({ example: 'Алексей', description: 'Имя пользователя' })
    readonly firstName: string

    @ApiProperty({ example: 'Машков', description: 'Фамилия пользователя' })
    readonly lastName: string

    @ApiProperty({ example: 'Петрович', description: 'Отчество пользователя' })
    readonly patronymic: string

    @ApiProperty({ example: 'Alex@mail.com', description: 'Логин пользователя' })
    readonly login: string

    @ApiProperty({ example: 'alex123', description: 'Пароль пользователя' })
    readonly password: string

    @ApiProperty({ example: 'manager', description: 'Роль пользователя: руководитель или пользователь' })
    readonly role: string
}
