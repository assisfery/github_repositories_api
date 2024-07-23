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

  importOne(login: string) {
    const user = this.findOneInGithub(login);

    return user;
  }

  findOneInGithub(login: string) {
    const gitApiUrl = this.configService.get<string>('github_api_url')
    
    

    return gitApiUrl;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
