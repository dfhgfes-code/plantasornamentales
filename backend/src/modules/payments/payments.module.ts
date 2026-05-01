import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WompiService } from './wompi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService, WompiService],
  exports: [TypeOrmModule, PaymentsService, WompiService],
})
export class PaymentsModule {}
