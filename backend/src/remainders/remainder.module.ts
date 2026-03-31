import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RemindersService } from './remainder.service';
import { RemindersController } from './remainder.controller';

@Module({
  imports: [DatabaseModule],
  providers: [RemindersService],
  controllers: [RemindersController],
})
export class RemindersModule {}