import {Router} from "express"
import { adminProjectadminMiddleware } from "../middleware/admin-project_admin.middleware.js"
import authMiddlware from "../middleware/auth-middlware.js"
import { createTask,updateSubTask,updateTaskContent,changeAssignToPerson,deleteSubTask,deleteTask,createSubTask,GetTaskDetails, GetProjectTask } from "../controllers/task-controller.js"


const TaskRouter=Router()

TaskRouter.route("/createTask/:projectId").post(authMiddlware,adminProjectadminMiddleware,createTask)
TaskRouter.route("updateTaskContent/:projectId/t/:taskId").put(authMiddlware,adminProjectadminMiddleware,updateTaskContent)
TaskRouter.route("changeAssignPerson/:projectId/t/:taskId").put(authMiddlware,adminProjectadminMiddleware,changeAssignToPerson)
TaskRouter.route("/deleteTask/:projectId/t/taskId").delete(authMiddlware,adminProjectadminMiddleware,deleteTask)
TaskRouter.route("/createsubtask/:projectId/st/:subTaskId").post(authMiddlware,adminProjectadminMiddleware,createSubTask)
TaskRouter.route("/deleteSubtask/:projectId/st/subTaskId").delete(authMiddlware,adminProjectadminMiddleware,deleteSubTask)

//role based wale thode smjh nhi rahe hai kais karna hai kyakarna hai usme isliye ise neeche rakha hai
TaskRouter.route("/updateSubtask/:projectId/st/:subTaskId").put(authMiddlware,updateSubTask)
TaskRouter.route("/getTaskdetails/:projectId/t/:taskId").get(authMiddlware,GetTaskDetails)
TaskRouter.route("/listProjectTask/:projectId").get(authMiddlware,GetProjectTask)




export default TaskRouter