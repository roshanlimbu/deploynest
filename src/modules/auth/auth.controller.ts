import { getAuthenticatedUser, unauthorizedResponse } from "./auth.middleware";
import {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
} from "./auth.service";
import {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateProfileInput,
} from "./auth.validation";
import { signJwt } from "./jwt";

export async function registerController(req: Request) {
  try {
    const body = await req.json();

    const validation = validateRegisterInput(body);

    if (!validation.success) {
      return Response.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const user = await registerUser(validation.data);
    const token = signJwt({ userId: user.id });

    return Response.json(
      {
        message: "User registered successfully",
        token,
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return Response.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    console.error(error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function loginController(req: Request) {
  try {
    const body = await req.json();

    const validation = validateLoginInput(body);

    if (!validation.success) {
      return Response.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const user = await loginUser(validation.data);
    const token = signJwt({ userId: user.id });

    return Response.json(
      {
        message: "Signed in successfully",
        token,
        user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.error(error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function meController(req: Request) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const user = await getUserById(authUser.id);
  if (!user) return unauthorizedResponse();

  return Response.json({ user }, { status: 200 });
}

export async function updateProfileController(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    const body = await req.json();
    const validation = validateUpdateProfileInput(body);

    if (!validation.success) {
      return Response.json({ message: validation.message }, { status: 400 });
    }

    const user = await updateUserProfile(authUser.id, validation.data);
    if (!user) return unauthorizedResponse();

    return Response.json({ user }, { status: 200 });
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return Response.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    }

    console.error(error);

    return Response.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

