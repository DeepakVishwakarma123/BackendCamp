import { Router } from "express";
import validate from "../validators/validate.js";
import validateMiddleWare from "../middleware/validate-result-middleware.js";
import registerController from "../controllers/Register-controller.js";

const RegisterRouter=Router()

RegisterRouter.route("/").post(validate(),validateMiddleWare,registerController)

export default RegisterRouter