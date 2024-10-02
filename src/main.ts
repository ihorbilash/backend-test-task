import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'public', 'uploads'), {
    prefix: '/uploads', 
  });

  const configSwager = new DocumentBuilder()
  .setTitle('Backend Test Task')
  .setDescription('Backend API description')
  .setVersion('1.0')
  .addTag('Test Task')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  },
  'JWT-auth',
)
  .build();

  const app_CONFIG = app.get(ConfigService);
  const app_CONFIG_PORT = app_CONFIG.get<string>('APP_PORT');

 

  const document = SwaggerModule.createDocument(app, configSwager);
  SwaggerModule.setup('doc', app, document);

  await app.listen(app_CONFIG_PORT, () => {
    console.log(`server app on ${app_CONFIG_PORT} port`);
  });
}
bootstrap();
