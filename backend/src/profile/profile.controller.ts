import { Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/user/user.decorator';
import { ProfileRO } from './profile.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 회원 프로필 가져오기
  @Get('/:username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  // 회원 팔로우 하기
  @Post('/:username/follow')
  async follow(
    @User('email') email: string,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    console.log(email, username);

    return await this.profileService.follow(email, username);
  }
}
