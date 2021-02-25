import { Entity, Column, ManyToOne, RelationId, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';
import { Users } from '../Users/Users';

@Entity('links')
export class Links {

    constructor() { }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    longUrl: string;

    @Column()
    shortUrl: string;

    @Index()
    @Column()
    code: string;

    @Column()
    date: string;

    @Column({ nullable: true, default: false })
    isDisabled: boolean;

    @RelationId((r: Links) => r.user)
    @Column()
    userId: number;

    @ManyToOne(type => Users, users => users.links)
    user: Users;
}