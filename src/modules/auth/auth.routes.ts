import { router } from "../../lib/router";
import {
  registerController,
  loginController,
  meController,
  updateProfileController,
} from "./auth.controller";

router.post("/auth/register", registerController);
router.post("/auth/login", loginController);
router.get("/auth/me", meController);
router.put("/auth/me", updateProfileController);
