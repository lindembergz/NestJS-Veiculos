import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req): Promise<UserProfileDto> {
    return this.userService.getProfile(req.user.username);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserProfileDto: UpdateUserProfileDto): Promise<string> {
    const result = await this.userService.updateProfile(req.user.username, updateUserProfileDto);
    if (!result) {
      return 'Update failed.';
    }
    return 'Update successful.';
  }
}