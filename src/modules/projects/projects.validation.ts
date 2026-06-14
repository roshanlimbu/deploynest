export type ProjectInput = {
  name: string;
  repoUrl: string;
  branch: string;
};

type ProjectValidationResult =
  | { success: true; data: ProjectInput }
  | { success: false; message: string };

export function validateProjectInput(body: any): ProjectValidationResult {
  const name = String(body.name ?? "").trim();
  const repoUrl = String(body.repoUrl ?? "").trim();
  const branch = String(body.branch ?? "main").trim() || "main";

  if (!name || !repoUrl) {
    return {
      success: false,
      message: "name and repoUrl are required",
    };
  }

  return {
    success: true,
    data: {
      name,
      repoUrl,
      branch,
    },
  };
}
