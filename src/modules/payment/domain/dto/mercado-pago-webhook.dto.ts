import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

class MercadoPagoWebhookDataDto {
  @ApiProperty({ description: "Payment ID", example: "1234567890" })
  @IsString()
  id!: string;
}

export class MercadoPagoWebhookDto {
  @ApiProperty({ description: "Type of the event", example: "payment" })
  @IsString()
  type!: string;

  @ApiProperty({ description: "Data object containing payment id" })
  @IsObject()
  @ValidateNested()
  @Type(() => MercadoPagoWebhookDataDto)
  data!: MercadoPagoWebhookDataDto;
}