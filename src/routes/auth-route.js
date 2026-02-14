import { Router} from "express";
import { loginController } from "../controllers/auth-controller.js";
import { loginValidate, passwordChange, userForgotPasswordValidator, userResetPasswordForgotValidator } from "../validators/validate.js";
import validateMiddleWare from "../middleware/validate-result-middleware.js";
import { logoutController } from "../controllers/auth-controller.js";
import authMiddlware from "../middleware/auth-middlware.js";
import { getCurrentUser } from "../controllers/auth-controller.js";
import { refreshAccessToken} from "../controllers/auth-controller.js";
import { changePassword } from "../controllers/auth-controller.js";
import { resetPassword } from "../controllers/auth-controller.js";
import { forgotPasswordRequest } from "../controllers/auth-controller.js";

const authRouter=Router()

//
authRouter.route("/login").post(loginValidate(),validateMiddleWare,loginController)
authRouter.route("/logout").post(authMiddlware,logoutController)

authRouter.route("/current-user").get(authMiddlware,getCurrentUser)
authRouter.route("/refresh-token").post(refreshAccessToken)
authRouter.route("/forgot-password").post(userForgotPasswordValidator(),validateMiddleWare,forgotPasswordRequest)
authRouter.route("/reset-password/:resetToken").post(userResetPasswordForgotValidator(),validateMiddleWare,resetPassword)
authRouter.route("/change-password").post(authMiddlware,passwordChange(),validateMiddleWare,changePassword)


export default authRouter