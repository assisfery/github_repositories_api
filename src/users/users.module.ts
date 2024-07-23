import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [
    ConfigModule,
    GithubModule
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
