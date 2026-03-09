import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './Subscriptions/subscription.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersModule } from './remainders/remainder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    ScheduleModule.forRoot(),

    TerminusModule,DatabaseModule,
    AuthModule,
    DashboardModule,
    AiModule,  
    UsersModule, 
    SubscriptionsModule,
    RemindersModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
