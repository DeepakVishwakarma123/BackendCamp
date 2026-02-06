import { Router} from "express";
import { loginController } from "../controllers/auth-controller.js";
import { loginValidate } from "../validators/validate.js";
import validateMiddleWare from "../middleware/validate-result-middleware.js";
import { logoutController } from "../controllers/auth-controller.js";
import authMiddlware from "../middleware/auth-middlware.js";

const authRouter=Router()

//
authRouter.route("/login").post(loginValidate(),validateMiddleWare,loginController)
authRouter.route("/logout").post(authMiddlware,logoutController)


export default authRouter