import { NestFactory } from '@nestjs/core';
import { WinstonLogger } from '@phobos/infrastructure';

import { AppModule } from './app.module';
import { RpcModule } from 'lib/rpc/rpc-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  const logger = await app.resolve(WinstonLogger);
  const rpcModule = new RpcModule();

  app.enableCors();
  app.useLogger(logger);

  rpcModule.register(app["container"], logger);

  await app.listen(3900);
}
bootstrap();
