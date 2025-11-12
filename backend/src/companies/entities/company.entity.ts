import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 150 })
  name: string;

  @Column({ length: 150 })
  business: string;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ length: 20 })
  password: string;

  @Column({ length: 150 })
  street: string;

  @Column({ length: 8 })
  number: string;

  @Column({ length: 150 })
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ length: 14 })
  phone: string;

  @Column({ unique: true, length: 150 })
  email: string;
}