import { ApiProperty } from "@nestjs/swagger"

export class AuthUserDto {
    @ApiProperty({ example: 'Alex@mail.com', description: 'Логин пользователя'})
    readonly login: string

    @ApiProperty({ example: 'alex123', description: 'Пароль пользователя'})
    readonly password: string
}