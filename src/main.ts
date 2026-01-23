import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from '@scalar/nestjs-api-reference';
import "dotenv/config";
import "reflect-metadata";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true }),
	);

	app.setGlobalPrefix("api");

	app.enableCors();

	app.useGlobalPipes();

	const config = new DocumentBuilder()
		.setTitle("SampleApi")
		.setDescription("Sample backend service")
		.setVersion("1.0.0")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("swagger", app, document);

  app.use(
    '/docs',
    apiReference({
      url: '/openapi.json',
      withFastify: true,
    }),
  )

	await app.listen(3000, "0.0.0.0");
	console.log(`HTTP Server is running on Port 3000`);
}

bootstrap();
