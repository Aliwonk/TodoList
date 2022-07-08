import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({ example: 'Todo приложения', description: 'Заголовок задачи' })
    readonly caption: string

    @ApiProperty({ example: 'Разработка todo приложения', description: 'Описание задачи' })
    readonly description: string
    
    @ApiProperty({ example: '2022-08-10', description: 'Дата окончание задачи' })
    readonly endDate: Date

    @ApiProperty({ example: 'middle', description: 'Приоритет задачи'})
    readonly priority: string

    @ApiProperty({ example: 'to fulfillment', description: 'Статус задачи' })
    readonly status: string

    @ApiProperty({ example: '2', description: 'id подчиненного' })
    readonly responsible: any

}