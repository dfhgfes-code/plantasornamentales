import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Recipient } from '../recipients/entities/recipient.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsScheduler } from './subscriptions.scheduler';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Plan, Recipient]),
    OrdersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsScheduler],
  exports: [TypeOrmModule, SubscriptionsService],
})
export class SubscriptionsModule {}
