import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubscriptionsService } from './subscription.service';
import { SubscriptionsController } from './subscription.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, CloudinaryService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}