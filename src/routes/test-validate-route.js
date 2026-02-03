import { Router } from "express";
import testValidateControl from "../controllers/test-request-controller-for-express-validator.js";
import { ExpressValidator } from "express-validator";

const {body}=new ExpressValidator()
const testValidateRouter=Router()

   
testValidateRouter.route("/").post(body('email').isEmail(),testValidateControl)

export default testValidateRouter