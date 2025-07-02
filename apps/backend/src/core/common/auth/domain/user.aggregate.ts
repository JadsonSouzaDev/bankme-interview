import { UserDto } from '@bankme/shared';
import {
  BaseAggregate,
  BaseAggregateProps,
} from '../../../common/domain/base-aggregate';
import { UserCreatedEvent } from './events/user-created.event';

type UserConstructor = {
  id?: string;
  login: string;
  password: string;
} & BaseAggregateProps;

export class User extends BaseAggregate<UserDto> {
  public readonly id: string;
  public login: string;
  public password: string;

  constructor(props: UserConstructor) {
    super(props);
    this.id = props.id || crypto.randomUUID();
    this.login = props.login;
    this.password = props.password;
  }

  public static create(props: UserConstructor): User {
    const user = new User({
      ...props,
    });

    user.addDomainEvent(
      new UserCreatedEvent({
        userId: user.id,
        login: user.login,
      }),
    );

    return user;
  }

  public toDto(): UserDto {
    return {
      id: this.id,
      login: this.login,
    };
  }
}
