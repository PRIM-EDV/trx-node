import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RpcModule } from './core/rpc/rpc-module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rpcModule = new RpcModule();

  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  rpcModule.register(app["container"]);
  
  await app.listen(3900);
}
bootstrap();
