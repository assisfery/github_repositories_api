import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity('users')
@Unique(["login"])
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    avatar_url: string;

}
