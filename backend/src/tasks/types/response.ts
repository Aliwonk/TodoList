import { ApiProperty } from "@nestjs/swagger";

export class EmptyDataCreateTask {
    @ApiProperty({ example: 'Пустые данные', description: 'Ошибка отуствие данных для создание задачи' })
    readonly error: string;
}

export class SuccesfullyCreateTask {
    @ApiProperty({ example: 'Задача создано', description: 'Успешная создание задачи' })
    readonly message: string
}

export class UnauthorizedCreateTask {
    @ApiProperty({ example: 'Неавторизован', description: 'Запрет создание задач для невторизованных пользователей'})
    readonly error: string
}

export class ForbiddenCreateTask {
    @ApiProperty({ example: 'Пользователь не имеет прав', description: 'Запрет пользователей не являющие руководителем' })
    readonly error: string
}

export class NotFoundResponsibleCreateTask {
    @ApiProperty({ example: 'Не найден ответсвенный за задачу пользователь', description: 'Ошибка при не нахождении ответсвенного пользователя в базу данных' })
    readonly error: string
}

export class SuccesfullyUpdateTask {
    @ApiProperty({ example: 'Обновление успешно' })
    readonly message: string
}

export class ErrorUpdateTask {
    @ApiProperty({ example: 'Ошибка обновления задачи' })
    readonly error: string
}

export class NotFoundGetTask {
    @ApiProperty({ example: 'Задача не найдена' })
    readonly error: string
}