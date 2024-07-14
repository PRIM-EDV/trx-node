import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcModule } from './core/rpc/rpc-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rpcModule = new RpcModule();

  app.enableCors();

  rpcModule.register(app["container"]);
  
  await app.listen(3900);
}
bootstrap();
