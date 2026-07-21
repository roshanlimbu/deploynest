export type ProjectInput = {
  name: string;
  repoUrl: string;
  branch: string;
  appType: "laravel" | "dockerfile";
  database?: {
    enabled: boolean;
    engine: "mysql" | "postgresql";
  };
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

  let database: ProjectInput["database"];
  if (body.database && body.database.enabled) {
    const engine = String(body.database.engine ?? "").trim();
    if (engine !== "mysql" && engine !== "postgresql") {
      return {
        success: false,
        message: "database.engine must be mysql or postgresql",
      };
    }
    database = { enabled: true, engine };
  }

  return {
    success: true,
    data: {
      name,
      repoUrl,
      branch,
      appType,
      database,
    },
  };
}
