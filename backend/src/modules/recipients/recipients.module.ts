import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipient } from './entities/recipient.entity';
import { RecipientsService } from './recipients.service';
import { RecipientsController } from './recipients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipient])],
  controllers: [RecipientsController],
  providers: [RecipientsService],
  exports: [TypeOrmModule, RecipientsService],
})
export class RecipientsModule {}
