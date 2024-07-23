import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubService } from 'src/github/github.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {

  constructor(
    private readonly githubService: GithubService,
    private readonly userRepository: UserRepository
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() : Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async findOne(login: string) : Promise<User>{
    const user = await this.userRepository.findOneBy({
      login: login
    });

    if(!user)
    {
      throw new NotFoundException(`Utilizador ${login} nao encontrado na base de dados, tente importar antes`);
    }

    return user;    
  }

  async importUser(login: string) {
    const githubUser = await this.githubService.findUser(login);

    const searchUuser = await this.userRepository.findOneBy({ id: githubUser.id });

    if(searchUuser)
    {
      throw new HttpException(`Utilizador ${login} ja foi importado`, HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create({
      id: githubUser.id,
      login: githubUser.login,
      avatar_url: githubUser.avatar_url,
    });

    await this.userRepository.save(user);

    return user;
  }

  async importRepositories(login: string) {
    const user = await this.githubService.findRepositories(login);

    return user;
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
