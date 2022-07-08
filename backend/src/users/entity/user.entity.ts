import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { CreateTaskDto } from "../../tasks/dto/create-task.dto";
import { Task } from "../../tasks/entity/task.entity";

@Entity('users')
export class User {
    @ApiProperty({example: '1', description: 'id пользователя'})
    @PrimaryGeneratedColumn({type: 'int'})
    id: number;
    
    @ApiProperty({example: 'Алексей', description: 'Имя пользователя'})
    @Column({type: 'text'})
    firstName: string;

    @ApiProperty({example: 'Машков', description: 'Фамилия пользователя'})
    @Column({type: 'text'})
    lastName: string;

    @ApiProperty({example: 'Петрович', description: 'Отчество пользователя'})
    @Column({type: 'text'})
    patronymic: string;

    @ApiProperty({example: 'Alex@mail.com', description: 'Логин пользователя'})
    @Column({type: 'varchar', unique: true})
    login: string;

    @ApiProperty({example: 'alex123', description: 'Пароль пользователя'})
    @Column({type: 'varchar', length: 255})
    password: string;

    @ApiProperty({examples: ['manager', 'user'], description: 'Роль пользователя: руководитель или пользователь'})
    @Column({type: 'text'})
    role: string

    @ApiProperty({ type: [CreateTaskDto] })
    @ManyToMany(() => Task)
    @JoinTable({ name: 'user_tasks' })
    tasks: Task[]
}