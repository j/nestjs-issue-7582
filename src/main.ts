import { NestFactory } from '@nestjs/core';
import { Module, OnModuleInit } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

const order: string[] = [];

async function delay(name: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name}`);

      order.push(name);

      resolve();
    }, 1000);
  });
}

@Module({
  imports: [],
})
export class AModule implements OnModuleInit {
  async onModuleInit(): Promise<any> {
    await delay('AModule');
  }
}

@Module({
  imports: [AModule],
})
export class BModule implements OnModuleInit {
  async onModuleInit(): Promise<any> {
    await delay('BModule');
  }
}

@Module({
  imports: [BModule],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<any> {
    await delay('AppModule');
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(6000);

  console.log(order); // ['AModule', 'AppModule', 'BModule'] --- this should be ['AModule', 'BModule', 'AppModule']
}
bootstrap();
