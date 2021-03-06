import { config } from "../config/config.ts";
import {
  authRoutes,
  bannerRoutes,
  resetRoutes,
  userRoutes,
} from "../controllers/controllers.ts";
import { Router } from "../utils/deps.ts";

const {
  API_SERVER_PATH,
} = config;

const router = new Router({ prefix: API_SERVER_PATH });

router.get("/", bannerRoutes.Banner);

router.post("register", ...authRoutes.Register)
  .post("login", authRoutes.Login)
  .get("user", ...authRoutes.Me)
  .post("logout", ...authRoutes.Logout)
  .post("token", ...authRoutes.Token)
  .get("token/:resultId", ...authRoutes.TokenResult);

router.get(
  "users",
  ...userRoutes.GetUsers,
)
  .get("users/:id", ...userRoutes.GetUserById)
  .patch("users/:id", ...userRoutes.UpdateUserById)
  .delete("users/:id", ...userRoutes.DeleteUserById)
  .patch("me/change_password", ...userRoutes.ChangePassword);

router.post("request_reset", ...resetRoutes.RequestReset)
  .post("reset/:requestId", ...resetRoutes.Reset);

export default router;
