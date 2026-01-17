import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Env } from "../config/config.module";
import { payments } from "../config/db/schema/payments";

export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

@Global()
@Module({
	providers: [
		{
			provide: DATABASE_CONNECTION,
			useFactory: (configService: ConfigService<Env>) => {
				return drizzle({
					connection: {
						connectionString: configService.get("DATABASE_URL", {
							infer: true,
						}),
					},
					schema: {
						payments,
					},
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
