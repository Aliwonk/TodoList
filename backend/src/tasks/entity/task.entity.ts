import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entity/user.entity";
import { CreateUserDto } from "../../users/dto/create-user.dto";

@Entity('tasks')
export class Task{
    @ApiProperty({ example: 1, description: 'id задачи' })
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty({ example: 'Todo приложения', description: 'Заголовок задачи' })
    @Column({ type: 'varchar' })
    caption: string

    @ApiProperty({ example: 'Разработка todo приложения', description: 'Описание задачи' })
    @Column({ type: 'varchar' })
    description: string
    
    @ApiProperty({ example: '21-08-2022', description: 'Дата окончание задачи' })
    @Column({ type: 'timestamp', })
    endDate: Date

    @ApiProperty({ example: '05-07-2022', description: 'Дата создание задачи' })
    @CreateDateColumn()
    createdDate: Date

    @ApiProperty({ example: '10-07-2022', description: 'Дата обновления задачи' })
    @UpdateDateColumn()
    updateDate: Date

    @ApiProperty({ example: 'middle', description: 'Приоритет задачи'})
    @Column({ type: 'text' })
    priority: string

    @ApiProperty({ example: 'to fulfillment', description: 'Статус задачи' })
    @Column({ type: 'varchar', default: 'to fulfillment' })
    status: string

    @ApiProperty({ type: CreateUserDto })
    @ManyToMany(() => User)
    @JoinTable({ name: 'tasks_creator' })
    creator: User[]

    @ApiProperty({ type: CreateUserDto })
    @ManyToMany(() => User)
    @JoinTable({ name: 'tasks_responsible' })
    responsible: User[]

}