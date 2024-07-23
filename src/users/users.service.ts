import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubService } from 'src/github/github.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    private readonly githubService: GithubService
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(login: string) {
    return `This action returns a #${login} user`;
  }

  async importOne(login: string) {
    const user = await this.githubService.findOneInGithub(login);

    return user;
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
