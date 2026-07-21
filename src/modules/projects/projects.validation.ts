export type ProjectInput = {
  name: string;
  repoUrl: string;
  branch: string;
  appType: "laravel" | "dockerfile";
};

type ProjectValidationResult =
  | { success: true; data: ProjectInput }
  | { success: false; message: string };

export function validateProjectInput(body: any): ProjectValidationResult {
  const name = String(body.name ?? "").trim();
  const repoUrl = String(body.repoUrl ?? "").trim();
  const branch = String(body.branch ?? "main").trim() || "main";
  const appType = String(body.appType ?? "dockerfile").trim();

  if (!name || !repoUrl) {
    return {
      success: false,
      message: "name and repoUrl are required",
    };
  }

  if (appType !== "laravel" && appType !== "dockerfile") {
    return {
      success: false,
      message: "appType must be laravel or dockerfile",
    };
  }

  return {
    success: true,
    data: {
      name,
      repoUrl,
      branch,
      appType,
    },
  };
}
