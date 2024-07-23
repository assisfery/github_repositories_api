import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(private configService: ConfigService) {}

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
    const user = await this.findOneInGithub(login);

    return user;
  }

  async findOneInGithub(login: string) {
    const url = this.configService.get<string>('github_api_url');    
    const response = await fetch(url + '/users/' + login);
    return response.json();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
