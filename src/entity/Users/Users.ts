import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class Users {
    constructor() { }

    @PrimaryColumn()
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    dateOfJoining: number;

}