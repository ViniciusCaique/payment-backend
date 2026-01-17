import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import z from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error('Invalid environment variables', result.error.format());
          throw new Error('Invalid environment variables');
        }
        return result.data;
      },
    }),
  ],
})
export class ConfigModule {}
