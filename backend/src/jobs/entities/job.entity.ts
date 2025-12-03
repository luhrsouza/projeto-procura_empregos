import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  area: string;

  @Column({ length: 2 })
  state: string;

  @Column()
  city: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  salary: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToMany(() => User)
  @JoinTable({ name: 'job_candidates' })
  candidates: User[];
}