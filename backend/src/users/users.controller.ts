import { Controller, Get, Delete, Req, UseGuards, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // Get logged-in user profile
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  // Update profile
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  // Delete own account
  @Delete('account')
  deleteAccount(@Req() req: any) {
    return this.usersService.deleteUser(req.user.sub);
  }

}