import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(username: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return { username: user.username, email: user.email };
  }

  async updateProfile(username: string, updateUserProfileDto: UpdateUserProfileDto): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (updateUserProfileDto.username) {
      user.username = updateUserProfileDto.username;
    }
    if (updateUserProfileDto.email) {
      user.email = updateUserProfileDto.email;
    }

    await this.userRepository.save(user);
    return true;
  }
}