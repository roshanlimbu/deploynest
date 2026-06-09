import { router } from "../../lib/router";
import { registerController } from "./auth.controller";

router.post("/auth/register", registerController);
