import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('TYPEORM_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.js')],
        migrations: [join(__dirname, '**', '*.migration.js')],
        migrationsTableName: config.get<string>('TYPEORM_MIGRATIONSTABLENAME'),
        migrationsRun: config.get<boolean>('TYPEORM_MIGRATIONSRUN'),
        synchronize: config.get<boolean>('TYPEORM_SYNCHRONIZE'),
        logging: config.get<boolean>('TYPEORM_LOGGING'),
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
