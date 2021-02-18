import { Entity, Column,PrimaryColumn } from 'typeorm';

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
}