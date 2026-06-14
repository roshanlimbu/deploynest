import { verifyJwt } from "./jwt";

export type AuthenticatedUser = {
  id: number;
};

export function getAuthenticatedUser(req: Request): AuthenticatedUser | null {
  const authorization = req.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) return null;

  const payload = verifyJwt(token);
  const userId = Number(payload?.userId);

  if (!Number.isInteger(userId)) return null;

  return { id: userId };
}

export function unauthorizedResponse() {
  return Response.json({ message: "Unauthorized" }, { status: 401 });
}
