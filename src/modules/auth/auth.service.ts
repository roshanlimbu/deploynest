import { and, eq, ne } from "drizzle-orm";
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

  if (!newUser) {
    throw new Error("USER_CREATE_FAILED");
  }

  return newUser;
}

type LoginServiceInput = {
  email: string;
  password: string;
};

export async function loginUser(input: LoginServiceInput) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordCorrect = await Bun.password.verify(input.password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function getUserById(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user ?? null;
}

type UpdateProfileInput = {
  username: string;
  email: string;
};

export async function updateUserProfile(
  userId: number,
  input: UpdateProfileInput,
) {
  const existingUser = await db.query.users.findFirst({
    where: and(eq(users.email, input.email), ne(users.id, userId)),
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      username: input.username,
      email: input.email,
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      createdAt: users.createdAt,
    });

  return updatedUser ?? null;
}
