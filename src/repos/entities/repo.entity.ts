import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity('repos')
export class Repo {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    language: string;

    @Column('timestamptz')
    created_at: Date;

    @ManyToOne(() => User, (user) => user.repos)
    user: User;

}
