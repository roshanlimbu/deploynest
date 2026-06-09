import { registerUser } from "./auth.service";
import { validateRegisterInput } from "./auth.validation";

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

    return Response.json(
      {
        message: "User registered successfully",
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


