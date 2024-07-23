import { Repo } from "src/repos/entities/repo.entity";
import { Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";

@Entity('users')
@Unique(["login"])
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    avatar_url: string;

    @OneToMany(() => Repo, (repo) => repo.user)
    repos: Repo[];

}
