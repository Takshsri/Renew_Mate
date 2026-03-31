import { Controller, Get } from '@nestjs/common';
import { RemindersService } from './remainder.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get('upcoming')
  async getUpcomingRenewals() {
    return this.remindersService.getUpcomingRenewals();
  }
}