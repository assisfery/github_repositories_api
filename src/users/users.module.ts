import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from 'src/github/github.module';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ReposModule } from 'src/repos/repos.module';

@Module({
  imports: [
    ConfigModule,
    GithubModule,
    TypeOrmModule.forFeature([User]),
    ReposModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository]
})
export class UsersModule {}
