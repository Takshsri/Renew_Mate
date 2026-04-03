import { Controller, Post, Get, Delete, Body, Param,Patch, UseGuards, Req } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsService } from './subscription.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('invoice'))
  async create(
    @UploadedFile() file: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() req: any

  ) {
let invoiceUrl: string | undefined;

  if (file) {
    const upload: any = await this.cloudinaryService.uploadFile(file);
    invoiceUrl = upload.secure_url;
  }

  const userId = req.user.sub; // from JWT

  return this.subscriptionsService.create(
    { ...createSubscriptionDto, userId },
    invoiceUrl
  );  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }
@Get(':id')
findOne(@Param('id') id: string) {
  return this.subscriptionsService.findOne(id);
}
  @Get('user/:userId')
findUserSubscriptions(@Param('userId') userId: string) {
  return this.subscriptionsService.findUserSubscriptions(userId);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

@Patch(':id')
@UseInterceptors(FileInterceptor('invoice'))
async update(
  @Param('id') id: string,
  @UploadedFile() file: any,
  @Body() updateSubscriptionDto: UpdateSubscriptionDto,
) {
  let invoiceUrl: string | undefined;

  if (file) {
    const upload: any = await this.cloudinaryService.uploadFile(file);
    invoiceUrl = upload.secure_url;
  }

  return this.subscriptionsService.update(
    id,
    updateSubscriptionDto,
    invoiceUrl,
  );
}
}