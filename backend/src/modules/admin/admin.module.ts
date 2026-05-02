import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Recipient } from '../recipients/entities/recipient.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProductsModule } from '../products/products.module';
import { PlansModule } from '../plans/plans.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { SupabaseService } from '../../common/services/supabase.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Product, Subscription, Payment, Recipient]),
    MulterModule.register(),
    ProductsModule,
    PlansModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, SupabaseService],
})
export class AdminModule {}
