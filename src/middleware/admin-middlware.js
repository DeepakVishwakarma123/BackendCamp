import asyncHandler from "../utils/async-handlers.js";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import Project from "../models/projects-model.js";
import { UserRolesEnum } from "../utils/constants.js";

let adminCheckMiddleware=asyncHandler(
    async function (req,res,next) {
        let userid=req["user"]["_id"]
        let ProjectDocument=await Project.findById(
            userid
        )
        if(ProjectDocument["Role"]===UserRolesEnum.ADMIN)
        {  
            //rouoting to the next route
            next()
        }
        return res.status(403,new apiResponse(
       403,"admin only you don,t have allowed"
        ))

    }
)

export default adminCheckMiddleware