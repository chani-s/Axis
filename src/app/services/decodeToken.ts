import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const secret = process.env.TOKEN_SECRET_KEY;

export async function verifyAuthToken(authToken: string) {
  if (!secret) {
    throw new Error("Missing key");
  }

  try {
    const decodedToken = jwt.verify(authToken, secret) as { userId: string };

    if (!decodedToken || !decodedToken.userId) {
      throw new Error("Invalid token");
    }

    return new ObjectId(decodedToken.userId);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
