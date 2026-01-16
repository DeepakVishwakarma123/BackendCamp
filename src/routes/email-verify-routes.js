import { Router} from "express";
import verfiyEmail from "../controllers/email-verification-controller.js";

let emailVerifyRouter=Router()

emailVerifyRouter.route('/:temporaryToken/:userId').get(verfiyEmail)

export default emailVerifyRouter