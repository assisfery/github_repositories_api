import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubService } from 'src/github/github.service';
import { GetRepoFilterDto } from 'src/repos/dto/get-repo-filter.dto';
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

    const take = getUserFilterDto.take || 10;
    const skip = getUserFilterDto.skip || 0;

    let query = this.userRepository.createQueryBuilder("users");

    if(getUserFilterDto.login)
    {
      query.where({
        login: Like(`%${getUserFilterDto.login}%`)
      });      
    }

    const users = await query
      .take(take)
      .skip(skip)
      .getMany();

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

  async getUserRepositories(login: string, getRepoFilterDto: GetRepoFilterDto) : Promise<Repo[]>{
    this.logger.log(`Searching for user ${login} repositories in local database...`);

    let user = await this.userRepository.findOneBy({
      login: login
    });

    if(!user)
    {
      throw new NotFoundException(`Utilizador ${login} não foi encontrado na base de dados, tente importar antes`);
    }

    const take = getRepoFilterDto.take || 10;
    const skip = getRepoFilterDto.skip || 0;

    let query = this.repoRepository.createQueryBuilder("repos");
    query.where({ user });

    if(getRepoFilterDto.name)
    {
      query.andWhere('LOWER(name) LIKE LOWER(:name)', {
        name: `%${getRepoFilterDto.name}%`
      });
    }

    if(getRepoFilterDto.description)
    {
      query.andWhere('LOWER(description) LIKE LOWER(:description)', {
        description: `%${getRepoFilterDto.description}%`
      });
    }

    if(getRepoFilterDto.language)
    {
      query.andWhere('language = :language', {
        language: getRepoFilterDto.language
      });
    }

    const repos = await query
      .take(take)
      .skip(skip)
      .getMany();

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

    await Promise.all(githubRepositories.map( async(githubRepo) => {

      let searchRepo = await this.repoRepository.findOneBy({
        id: githubRepo.id
      });

      if(searchRepo)
      {
        return;
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

    }));

    return githubRepositories;
  }
  
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
