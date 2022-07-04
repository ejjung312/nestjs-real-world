import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { FollowsEntity } from './follows.entity';
import { ProfileData, ProfileRO } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  // Partial - 특정 타입의 부분 집합을 만족하는 타입 정의
  // DeepPartial - 특정 타입 내의 객체의 부분 집합을 만족하는 타입 정의
  // async findOne(options?: DeepPartial<User>): Promise<ProfileRO> {
  // const user = await this.userRepository.findOne({
  //   where: options,
  // });
  // if (user) {
  //   delete user.id;
  //   delete user.password;
  // }
  // return { profile: user };
  // }

  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne({
      where: {
        username: followingUsername,
      },
    });

    if (!_profile) return;

    const profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
    };

    const follows = await this.followsRepository.findOne({
      where: {
        followerId: id,
        followingId: _profile.id,
      },
    });

    if (id) {
      // 확실한 논리연산자 반환
      profile.following = !!follows;
    }

    return { profile };
  }

  async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException(
        'Follower email and username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const followingUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    const followerUser = await this.userRepository.findOne({
      where: {
        email: followerEmail,
      },
    });

    if (followerUser.email === followerEmail) {
      throw new HttpException(
        'FollowerEmail and FollowingId cannot be equal.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _follows = await this.followsRepository.findOne({
      where: {
        followerId: followerUser.id,
        followingId: followingUser.id,
      },
    });

    if (!_follows) {
      const follows = new FollowsEntity();
      follows.followerId = followerUser.id;
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
    }

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    return { profile };
  }
}
