import { IsString, IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  WEEKLY = 'WEEKLY'
}

export class CreateSubscriptionDto {

  @IsString()
  serviceName: string;

  @IsNumber()
  price: number;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  renewalDate: Date;

  @IsString()
  userId: string;
  @IsOptional()
  @IsString()
  invoiceUrl?: string;

}