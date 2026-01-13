import { Router } from "express";
import registerController from "../controllers/Register-controller.js";

const RegisterRouter=Router()

RegisterRouter.route("/").post(registerController)

export default RegisterRouter