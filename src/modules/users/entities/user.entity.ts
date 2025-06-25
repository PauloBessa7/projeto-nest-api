// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn('uuid') // Gera um UUID para o ID
  id: string;

  @Column({ unique: true }) // Garante que o email seja único
  email: string;

  @Column()
  password: string; // A senha será armazenada hashada

  @Column({ nullable: true }) // Opcional
  firstName: string;

  @Column({ nullable: true }) // Opcional
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}