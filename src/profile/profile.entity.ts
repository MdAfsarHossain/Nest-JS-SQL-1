/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: true,
        length: 100
    })
    firstName: string;

    @Column({
        type: "varchar",
        nullable: true,
        length: 100
    })
    lastName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 10
    })
    gender: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    dateOfBirth: Date;

    @Column({
        type: 'text',
        nullable: true
    })
    bio: string

    @Column({
        type: "text",
        nullable: true
    })
    profileImage: string

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
    
    @DeleteDateColumn()
    deleteAt: Date;
}