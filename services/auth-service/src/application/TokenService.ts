import { UserRole } from "../domain/User";

export interface TokenPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
}
