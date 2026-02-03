import { Router } from "express";
import dummyTest from "../controllers/dummy-test-controller.js";
import { body } from "express-validator";
import testValidateControl from "../controllers/test-request-controller-for-express-validator.js";

const dummyTestRouter=Router()

const common=body('email').isEmail()
dummyTestRouter.route("/t").post(common,testValidateControl)
console.log(common)
dummyTestRouter.route("/").post(common.isLength(15),dummyTest)
console.log(common)
export default dummyTestRouter