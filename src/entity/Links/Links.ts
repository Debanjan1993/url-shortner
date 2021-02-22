import { Entity, Column,PrimaryColumn, ManyToOne, RelationId,PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../Users/Users';

@Entity('links')
export class Links {

    constructor(){}

    @PrimaryColumn() 
    longUrl: string;

    @Column({ nullable: true })
    shortUrl: string;

    @Column({ nullable: true })
    code: string;

    @Column({ nullable: true })
    date: number;

    @RelationId((r:Links)=> r.user)
    @Column()
    userId: number;

    @ManyToOne(type=> Users, users=> users.links)
    user: Users;
}