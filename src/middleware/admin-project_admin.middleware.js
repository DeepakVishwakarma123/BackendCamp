import asyncHandler from "../utils/async-handlers.js";
import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";
import ProjectMember from "../models/project-member.js";
import { UserRolesEnum } from "../utils/constants.js";

//this middleware checks whether you are admin or project admin then passes your request to next phase
let adminProjectadminMiddleware=asyncHandler(
    async function (req,res,next) {
        //we get this value only if authmiddleware succesfully passed otherwise not
        let userId=req.user._id 
        let {projectId}=req.params 
        //searching project Member collection with appropriate project id and user id to getting a required documents
        let userAsMemberDocument=await ProjectMember.findOne(
            {
                user:userId,
                Project:projectId
            }
        )

        //the above document contains admin ,project admin role pass request to next controller 
        //in case of member doesn,t allow request to process further send error message in response
        if(userAsMemberDocument.Role==="admin" || userAsMemberDocument.Role==="project_admin")
        {
            next()
        }

        res.status(403).json(
            new json('only admin,project admin are allowed,members are forbidden')
        )
    }
)

export {adminProjectadminMiddleware}
