import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health :HealthCheckService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('health')
  @HealthCheck()
  check(){
    return { status :'ok' };
  }
}
