import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubService } from 'src/github/github.service';
import { Repo } from 'src/repos/entities/repo.entity';
import { RepoRepository } from 'src/repos/repos.repository';
import { Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {

  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly githubService: GithubService,
    private readonly userRepository: UserRepository,
    private readonly repoRepository: RepoRepository
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async findAll(getUserFilterDto: GetUserFilterDto) : Promise<User[]> {
    let users = [];

    if(getUserFilterDto.login)
    {
      users = await this.userRepository.find({
        where: {
          login: Like(`%${getUserFilterDto.login}%`)
        }
      });
    }
    else
    {
      users = await this.userRepository.find();
    }

    return users;
  }

  async findOne(login: string) : Promise<User> {
    this.logger.log(`Searching for user ${login} in local database...`);

    const user = await this.userRepository.findOneBy({
      login: login
    });

    if(!user)
    {
      throw new NotFoundException(`Utilizador ${login} não foi encontrado na base de dados, tente importar antes`);
    }

    return user;    
  }

  async importUser(login: string) {
    this.logger.log(`Importing the user ${login} to local database...`);

    const githubUser = await this.githubService.findUser(login);

    const searchUser = await this.userRepository.findOneBy({ id: githubUser.id });

    if(searchUser)
    {
      throw new HttpException(`Utilizador ${login} já foi importado`, HttpStatus.BAD_REQUEST);
    }

    const user = await this.saveUser(githubUser);
    return user;
  }

  async saveUser(githubUser) {
    const user = this.userRepository.create({
      id: githubUser.id,
      login: githubUser.login.substring(0, 64),
      avatar_url: githubUser.avatar_url.substring(0, 256),
    });

    await this.userRepository.save(user);

    return user;
  }

  async getUserRepositories(login: string) : Promise<Repo[]>{
    this.logger.log(`Searching for user ${login} repositories in local database...`);

    let user = await this.userRepository.findOneBy({
      login: login
    });

    if(!user)
    {
      throw new NotFoundException(`Utilizador ${login} não foi encontrado na base de dados, tente importar antes`);
    }

    const repos = await this.repoRepository.find({
      where: { user: { id: user.id }},
    });

    return repos;
  }

  async importRepositories(login: string) {
    this.logger.log(`Importing repositories from the user ${login} to local database...`);

    let user = await this.userRepository.findOneBy({
      login: login
    });

    if(!user)
    {
      const githubUser = await this.githubService.findUser(login);
      user = await this.saveUser(githubUser);
    }

    const githubRepositories = await this.githubService.findRepositories(login);

    // githubRepositories.forEach(async (githubRepo) => {

    //   let searchRepo = await this.repoRepository.findOneBy({
    //     id: githubRepo.id
    //   });

    //   if(searchRepo)
    //     return;

    //   const repo = this.repoRepository.create({
    //     id: githubRepo.id,
    //     name: githubRepo.name.substring(0, 128),
    //     description: githubRepo.description.substring(0, 256),
    //     language: githubRepo.language.substring(0, 32),
    //     created_at: githubRepo.created_at,
    //     user,
    //   });
  
    //   await this.repoRepository.save(repo);

    // });

    for(let i = 0; i < githubRepositories.length; i++)
    {
      const githubRepo = githubRepositories[i];

      let searchRepo = await this.repoRepository.findOneBy({
        id: githubRepo.id
      });

      if(searchRepo)
      {
        continue;
      }

      const repo = this.repoRepository.create({
        id: githubRepo.id,
        name: githubRepo.name.substring(0, 128),
        description: githubRepo.description?.substring(0, 256),
        language: githubRepo.language?.substring(0, 32),
        created_at: githubRepo.created_at,
        user,
      });
  
      await this.repoRepository.save(repo);
    }

    return githubRepositories;
  }
  
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
