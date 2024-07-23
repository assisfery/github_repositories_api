import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";

@Entity('repos')
export class Repo {

    @PrimaryColumn()
    id: number;

    @Column({
        length: 128
    })
    name: string;

    @Column({
        length: 256,
        nullable: true
    })
    description: string;

    @Column({
        length: 32,
        nullable: true
    })
    language: string;

    @Column('timestamptz')
    created_at: Date;

    @ManyToOne(() => User, (user) => user.repos)
    user: User;

}
