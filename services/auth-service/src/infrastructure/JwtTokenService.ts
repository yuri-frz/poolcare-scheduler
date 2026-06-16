import jwt from "jsonwebtoken";
import { TokenPayload, TokenService } from "../application/TokenService";

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {}

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }
}
