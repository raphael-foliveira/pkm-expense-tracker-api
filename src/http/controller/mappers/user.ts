import { User } from '../../../persistence/entitites/user';

export interface UserResponseDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
