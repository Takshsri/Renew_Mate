import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { SubscriptionsService } from "./subscription.service";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@UseGuards(JwtAuthGuard)
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("invoice"))
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

    return this.subscriptionsService.create(
      { ...createSubscriptionDto, userId: req.user.sub },
      invoiceUrl
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.subscriptionsService.findUserSubscriptions(req.user.sub);
  }

  // ✅ MOVE THIS HERE
  @Get("renewals/upcoming")
  getUpcomingRenewals(@Req() req: any) {
    return this.subscriptionsService.getUpcomingRenewals(req.user.sub);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: any) {
    return this.subscriptionsService.findOne(id, req.user.sub);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: any) {
    return this.subscriptionsService.remove(id, req.user.sub);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("invoice"))
  async update(
    @Param("id") id: string,
    @UploadedFile() file: any,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @Req() req: any
  ) {
    let invoiceUrl: string | undefined;

    if (file) {
      const upload: any = await this.cloudinaryService.uploadFile(file);
      invoiceUrl = upload.secure_url;
    }

    return this.subscriptionsService.update(
      id,
      req.user.sub,
      updateSubscriptionDto,
      invoiceUrl
    );
  }
}