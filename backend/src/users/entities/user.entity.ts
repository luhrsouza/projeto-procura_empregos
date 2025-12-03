import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;
  
  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'datetime', nullable: true })
  lastActive: Date;

  @Column({ default: false })
  isOnline: boolean;
}