import { type } from 'os';
import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Links } from '../Links/Links';

@Entity('users')
export class Users {
    constructor() { }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    dateOfJoining: number;

    @Column()
    isPaidUser: boolean = false;

    @Column()
    isVerified: boolean = false

    @OneToMany(type => Links, links => links.user)
    links: Links[];

}