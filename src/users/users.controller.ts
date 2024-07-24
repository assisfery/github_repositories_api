import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { GetRepoFilterDto } from 'src/repos/dto/get-repo-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  async findAll(@Query() getUserFilterDto: GetUserFilterDto) {
    return await this.usersService.findAll(getUserFilterDto);
  }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    return await this.usersService.findOne(login);
  }

  @Get(':login/import')
  async importUser(@Param('login') login: string) {
    return await this.usersService.importUser(login);
  }

  @Get(':login/repos')
  async getUserRepositories(@Param('login') login: string, @Query() getRepoFilterDto: GetRepoFilterDto) {
    return await this.usersService.getUserRepositories(login, getRepoFilterDto);
  }

  @Get(':login/repos/import')
  async importRepositories(@Param('login') login: string) {
    return await this.usersService.importRepositories(login);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
