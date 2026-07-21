import { router } from "../../lib/router";
import {
  createDeploymentController,
  getDeploymentController,
  listDeploymentLogsController,
  listDeploymentsController,
  deleteDeploymentController,
} from "./deployments.controller";

router.post("/projects/:id/deployments", createDeploymentController);
router.get("/projects/:id/deployments", listDeploymentsController);
router.get("/deployments/:id", getDeploymentController);
router.delete("/deployments/:id", deleteDeploymentController);
router.get("/deployments/:id/logs", listDeploymentLogsController);
