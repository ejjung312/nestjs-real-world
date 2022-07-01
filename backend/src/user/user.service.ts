import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const { username, email, password } = dto;
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    //////////////////////////////////////////////////////////////////////////////
    // check username and email
    if (user) {
      const errors = { username: 'Username and email are already exists.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    //////////////////////////////////////////////////////////////////////////////
    // add user
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    // newUser.articles = [];

    const errors = await validate(newUser);
    if (errors.length > 0) {
      const _errors = { username: 'Username is not valid.' };
      throw new HttpException(
        { message: 'Validation failed.', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.userRepository.save(newUser);
      // return this.buildUserRO(savedUser);
    }
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

  public async generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    };

    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }

  private async buildUserRO(user: User) {
    const token = await this.generateJWT(user);

    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      token: token,
      image: user.image,
    };

    return { user: userRO };
  }
}
