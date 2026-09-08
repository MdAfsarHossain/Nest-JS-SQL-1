/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({
    //     type: "varchar",
    //     nullable: false,
    //     length: 100
    // })
    // firstName: string;

    // @Column({
    //     type: 'varchar',
    //     nullable: false,
    //     length: 100
    // })
    // lastName: string;

    // @Column({
    //     type: 'varchar',
    //     nullable: true,
    //     length: 10
    // })
    // gender: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 24,
        unique: true
    })
    username: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
        unique: true
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100
    })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}

