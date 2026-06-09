import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";




type RegistrInput = {
  username: string;
  email: string;
  password: string;
}


export async function registerUser(input: RegistrInput){
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if(existingUser){
    throw new Error("EMAIL_ALREADY_EXISTS");
  }


  const hashedPassword = await Bun.password.hash(input.password);

  const [newUser] = await db
  .insert(users)
  .values({
    username: input.username,
    email: input.email,
    passwordHash: hashedPassword,
  })
  .returning({
    id: users.id,
    username: users.username,
    email: users.email,
    createdAt: users.createdAt,
  });

  return newUser;
}
