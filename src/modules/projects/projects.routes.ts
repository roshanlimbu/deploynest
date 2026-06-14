import { router } from "../../lib/router";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  listProjectsController,
  updateProjectController,
} from "./projects.controller";

router.get("/projects", listProjectsController);
router.post("/projects", createProjectController);
router.get("/projects/:id", getProjectController);
router.put("/projects/:id", updateProjectController);
router.delete("/projects/:id", deleteProjectController);
