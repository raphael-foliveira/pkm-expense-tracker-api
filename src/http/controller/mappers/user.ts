import { User } from '../../../persistence/entitites/user';

export interface UserResponseDto
  extends Omit<User, 'password' | 'refreshToken' | 'id'> {}

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    const { id, password, refreshToken, expenses, ...userResponseDto } = user;
    return userResponseDto;
  }
}
