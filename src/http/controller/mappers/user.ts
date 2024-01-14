import { User } from '../../../persistence/entitites/user';

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

const toResponseDto = ({
  id = 0,
  username,
  email,
  firstName,
  lastName,
}: User): UserResponseDto => {
  return {
    id,
    username,
    email,
    fullName: `${firstName} ${lastName}`,
  };
};

export const userMapper = {
  toResponseDto,
};
