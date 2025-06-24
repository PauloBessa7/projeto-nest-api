
import { Injectable } from '@nestjs/common';
import { Role } from './enum/user.enum';
import { Plan } from './enum/plan.enum';
import { v4 as uuidv4 } from 'uuid';

export type User = any;

@Injectable()
export class UsersService {
  private CompaignPos(title: string, description: string) {
    const CompaignPost = {
      id: uuidv4(),
      title: title,
      description: description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return CompaignPost;
  }

  private ListCompaignPost1() {
    return [
      this.CompaignPos('Compaign Post 1', 'Compaign Post 1 Description'),
      this.CompaignPos('Compaign Post 2', 'Compaign Post 2 Description'),
      this.CompaignPos('Compaign Post 3', 'Compaign Post 3 Description'),
    ]
  }

  private readonly users = [
    {
      userId: uuidv4(),
      username: 'john',
      useremail: 'john@gmail.com',
      password: 'changeme',
      isActive: true,
      expiresAt: new Date('2017-06-01'),
      roles: [Role.Admin],
      plan: Plan.PLATINUM,
      compaignPost: this.ListCompaignPost1(),
    },
    {
      userId: uuidv4(),
      username: 'maria',
      useremail: 'maria@gmail.com',
      password: 'guess',
      isActive: true,
      expiresAt: new Date('2026-06-01'),
      roles: [Role.User],
      plan: Plan.GOLD,
      compaignPost: this.ListCompaignPost1(),
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  createUser(): string {
    return 'User created';
  }
}
