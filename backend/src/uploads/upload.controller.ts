import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post("invoice")
  @UseInterceptors(FileInterceptor("file"))
  async uploadInvoice(@UploadedFile() file: Express.Multer.File) {
    const upload: any = await this.cloudinaryService.uploadFile(file);

    return {
      url: upload.secure_url,
    };
  }
}