import { Module } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ReposController } from './repos.controller';
import { RepoRepository } from './repos.repository';
import { Repo } from './entities/repo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repo])
  ],
  controllers: [ReposController],
  providers: [ReposService, RepoRepository],
  exports: [
    RepoRepository
  ]
})
export class ReposModule {}
