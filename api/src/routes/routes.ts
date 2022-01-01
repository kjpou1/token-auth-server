import { Router } from "../utils/deps.ts";
import { config } from "../config/config.ts";
import {
  authRoutes,
  bannerRoutes,
  resetRoutes,
  userRoutes,
} from "../controllers/controllers.ts";

const {
  API_SERVER_PATH,
} = config;

const router = new Router({ prefix: API_SERVER_PATH });

router.get("/", bannerRoutes.Banner);

router.post("register", ...authRoutes.Register)
  .post("login", authRoutes.Login)
  .get("user", ...authRoutes.Me)
  .post("logout", ...authRoutes.Logout)
  .post("token", ...authRoutes.Token);

router.get(
  "users",
  ...userRoutes.GetUsers,
)
  .get("users/:id", ...userRoutes.GetUserById)
  .patch("users/:id", ...userRoutes.UpdateUserById)
  .delete("users/:id", ...userRoutes.DeleteUserById);

router.post("request_reset", ...resetRoutes.RequestReset)
  .post("reset/:requestId", ...resetRoutes.Reset);

export default router;
