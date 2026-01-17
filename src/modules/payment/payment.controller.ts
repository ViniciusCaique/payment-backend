import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePaymentUseCase } from "./application/usecases/create-payment";
import { GetPaymentUseCase } from "./application/usecases/get-payment";
import { GetPaymentsUseCase } from "./application/usecases/get-payments";
import { UpdatePaymentUseCase } from "./application/usecases/update-payment";
import { UpdatePaymentWebhookUseCase } from "./application/usecases/update-payment-webhook";
import { CreatePaymentDto } from "./domain/dto/create-payment.dto";
import { MercadoPagoWebhookDto } from "./domain/dto/mercado-pago-webhook.dto";
import { UpdatePaymentDto } from "./domain/dto/update-payment.dto";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
	constructor(
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly getPaymentsUseCase: GetPaymentsUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly updatePaymentWebhookUseCase: UpdatePaymentWebhookUseCase,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Payment', description: 'Get Payment' })
  @ApiResponse({ status: 200, description: 'Payment fetched successfully' })
  async getPayment(@Param() id: string) {
    const response = await this.getPaymentUseCase.execute({ id: id });
    return { data: response };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Payment', description: 'Get Payment' })
  @ApiResponse({ status: 200, description: 'Payment fetched successfully' })
  async getPayments(@Query('document') document?: string, @Query('paymentMethod') paymentMethod?: string) {
    const response = await this.getPaymentsUseCase.execute({ document: document, paymentMethod: paymentMethod });
    return { data: response };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Payment', description: 'Create Payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@Body() data: CreatePaymentDto) {
    const response = await this.createPaymentUseCase.execute({ data: data });
    return { data: response };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Payment', description: 'Update Payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  async updatePayment(@Param() id: string, @Body() data: UpdatePaymentDto) {
    const response = await this.updatePaymentUseCase.execute({ id: id, data: data });
    return { data: response };
  }

  @Patch('/webhooks/mercadopago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Payment', description: 'Update Payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  async updatePaymentWebhook(@Body() webhookData: MercadoPagoWebhookDto) {
    const { type, data } = webhookData;

    if (type !== 'payment') {
      return { message: 'Event ignored', type };
    }

    const response = await this.updatePaymentWebhookUseCase.execute({ id: data.id });
    return { data: response };
  }
}