import asyncHandler from "../utils/async-handlers.js";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import { Router } from "express";
import authMiddlware from "../middleware/auth-middlware.js";
import { createProject, deleteProject, updateProject ,InviteLinkGenerateAndMail, addInvitedMemberToProject} from "../controllers/project-controller.js";
import adminCheckMiddleware from "../middleware/admin-middlware.js";

const ProjectRouter=Router()



//create Project
ProjectRouter.route("/create").post(authMiddlware,createProject)
ProjectRouter.route("/update/:projectid").put(authMiddlware,adminCheckMiddleware,updateProject)
ProjectRouter.route("/delete:projectid").delete(authMiddlware,adminCheckMiddleware,deleteProject)
ProjectRouter.route("/Verifyinvitedmember/:inviteLinkId").post(authMiddlware,addInvitedMemberToProject)
ProjectRouter.route("/sendinvitelink/:ProjectId").post(InviteLinkGenerateAndMail)

// http://localhost:4001/api/v1/project/invitedMember/${inviteData._id}
export default ProjectRouter

