type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

type ValidationResult =
  | { success: true; data: RegisterInput }
  | { success: false; message: string };

export function validateRegisterInput(body: any): ValidationResult {
  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!username || !email || !password) {
    return {
      success: false,
      message: "username, email and password are required",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  return {
    success: true,
    data: {
      username,
      email,
      password,
    },
  };
}

type LoginInput = {
  email: string;
  password: string;
};

type LoginValidationResult =
  | { success: true; data: LoginInput }
  | { success: false; message: string };

export function validateLoginInput(body: any): LoginValidationResult {
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "email and password are required",
    };
  }

  return {
    success: true,
    data: {
      email,
      password,
    },
  };
}

type UpdateProfileInput = {
  username: string;
  email: string;
};

type UpdateProfileValidationResult =
  | { success: true; data: UpdateProfileInput }
  | { success: false; message: string };

export function validateUpdateProfileInput(
  body: any,
): UpdateProfileValidationResult {
  const username = String(body.username ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!username || !email) {
    return {
      success: false,
      message: "username and email are required",
    };
  }

  return {
    success: true,
    data: {
      username,
      email,
    },
  };
}
