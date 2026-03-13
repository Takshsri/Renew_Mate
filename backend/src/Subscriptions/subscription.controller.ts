import { Controller, Post, Get, Delete, Body, Param,Patch, UseGuards } from '@nestjs/common';
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createSubscriptionDto: CreateSubscriptionDto
  ) {

    let invoiceUrl: string | undefined;
    if (file) {
      const upload: any = await this.cloudinaryService.uploadFile(file);
      invoiceUrl = upload.secure_url;
    }

    return this.subscriptionsService.create(createSubscriptionDto, invoiceUrl);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':userId')
  findUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionsService.findUserSubscriptions(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }
}