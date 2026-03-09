import { CreateSubscriptionDto } from './create-subscription.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}