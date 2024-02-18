import { jwtService } from '../../../service/jwt.service';

export const jwtServiceMock = (
  methodName: keyof typeof jwtService,
  returnValue: any = {},
) => {
  return jest.spyOn(jwtService, methodName).mockReturnValue(returnValue);
};
