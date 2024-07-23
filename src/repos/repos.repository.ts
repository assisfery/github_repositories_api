import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Repo } from "./entities/repo.entity";

@Injectable()
export class RepoRepository extends Repository<Repo>{
    
    constructor(private dataSource: DataSource) {
        super(Repo, dataSource.createEntityManager());
    }

}