import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService = app.get(ConfigService);
  app.use(cookieParser(configService.get('COOKIE_KEY')));
  const port = configService.get<number>('PORT');


  const configDocument = new DocumentBuilder()
    .setTitle('Приложение TODO list')
    .setDescription(
      `Приложение которое может планировать деятельность пользователя и
       контролировать работу своих подчиненных при помощи
       механизма управления задачами.`
    )
    .setVersion('1.0')
    .build();
  const documentSwagger = SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('api-docs', app, documentSwagger);


  await app.listen(port, () => {
    console.log(`Server work on port ${port}`);
  });

}

bootstrap();
