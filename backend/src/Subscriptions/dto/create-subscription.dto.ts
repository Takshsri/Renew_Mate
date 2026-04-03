import { BillingCycle, SubscriptionStatus } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  serviceName: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  price: number;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsDateString()
  startDate: string;

  @IsDateString()
  renewalDate: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  invoiceUrl?: string;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @IsString()
  userId: string;
}