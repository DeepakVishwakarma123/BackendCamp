import asyncHandler from "../utils/async-handlers.js";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import { Router } from "express";
import authMiddlware from "../middleware/auth-middlware.js";
import { createProject, deleteProject, updateProject } from "../controllers/project-controller.js";
import adminCheckMiddleware from "../middleware/admin-middlware.js";

const ProjectRouter=Router()



//create Project
ProjectRouter.route("/create").post(authMiddlware,createProject)
ProjectRouter.route("/update/:projectid").put(authMiddlware,adminCheckMiddleware,updateProject)
ProjectRouter.route("/delete:projectid").delete(authMiddlware,adminCheckMiddleware,deleteProject)


export default ProjectRouter