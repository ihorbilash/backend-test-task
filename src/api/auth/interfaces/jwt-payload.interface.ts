import { IPayload } from './payload.interface';

export interface IJwtPayload extends IPayload {
  iat?: number;
  exp?: number;
}
