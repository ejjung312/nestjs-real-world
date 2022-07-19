import { Injectable } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserCommand } from './create-user.command';
import { TestEvent } from './test.event';
import { UserCreatedEvent } from './user-created.event';
import { User } from './user.entity';

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private eventBus: EventBus,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const userData = command;

    const newUser = new User();
    newUser.username = userData.username;
    newUser.email = userData.email;
    newUser.password = userData.password;

    await this.userRepository.save(newUser);

    this.eventBus.publish(new UserCreatedEvent(userData.email));
    this.eventBus.publish(new TestEvent());
  }
}
