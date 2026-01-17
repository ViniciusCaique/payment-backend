import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/config/config.module';
import { DatabaseModule } from './shared/database/database.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PaymentModule,
  ],
})
export class AppModule {}
