import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { ProfileRO } from './profile.interface';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard()) // 안하면 @User 데코레이션 사용 불가
@ApiTags('Profile API')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 회원 프로필 가져오기
  @Get('/:username')
  @ApiOperation({
    summary: '회원 프로필 API',
    description: '회원 프로필 가져오기 API',
  })
  @ApiOkResponse({ description: '회원의 프로필을 조회한다.' })
  @ApiParam({
    name: 'username',
    required: true,
    description: '조회 할 User의 이름',
  })
  async getProfile(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  // 회원 팔로우 하기
  @Post('/:username/follow')
  @ApiOperation({
    summary: 'User 팔로우 API',
    description: 'User 팔로우',
  })
  @ApiOkResponse({ description: 'User를 팔로우한다.' })
  @ApiParam({
    name: 'username',
    required: true,
    description: '팔로우 할 User의 이름',
  })
  async follow(
    @User('email') email: string,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  // 회원 언팔로우
  @Delete(':username/follow')
  @ApiOperation({
    summary: 'User 언팔로우 API',
    description: 'User 언팔로우',
  })
  @ApiOkResponse({ description: 'User를 언팔로우한다.' })
  @ApiParam({
    name: 'username',
    required: true,
    description: '언팔로우 할 User의 이름',
  })
  async unFollow(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }
}
