import { createZodDto } from 'nestjs-zod';
import { z } from 'zod/v4';

export const mercadoPagoWebhookBodySchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
  }),
});

export class MercadoPagoWebhookDto extends createZodDto(mercadoPagoWebhookBodySchema) {}