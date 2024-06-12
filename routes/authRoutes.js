import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//Register || method Post
router.post("/register", registerController);

//Login || POST
router.post("/login", loginController);

//forget password || method post
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route user auth
router.get("/user-auth", requireSignIn, (req, resp) => {
  resp.status(200).send({ ok: true });
});

//protected route admin auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, resp) => {
  resp.status(200).send({ ok: true });
});

//update profile

router.put("/profile", requireSignIn, updateProfileController);
export default router;
