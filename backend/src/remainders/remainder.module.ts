import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RemindersService } from './remainder.service';

@Module({
  imports: [DatabaseModule],
  providers: [RemindersService],
})
export class RemindersModule {}