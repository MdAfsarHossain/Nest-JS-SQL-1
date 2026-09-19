/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: true
    })
    text: string;

    @Column({
        type: 'text',
        nullable: true
    })
    image?:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tweets)
    user: User
}

