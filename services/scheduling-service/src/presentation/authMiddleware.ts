import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: "CLIENT" | "PROVIDER"; email: string };
}

export function authMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    response.status(401).json({ message: "Missing token" });
    return;
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET ?? "dev-secret") as AuthenticatedRequest["user"];
    next();
  } catch {
    response.status(401).json({ message: "Invalid token" });
  }
}
