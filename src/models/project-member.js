import mongoose from "mongoose"
import {Schema} from "mongoose"
import { assign } from "nodemailer/lib/shared"
import { availableUserRoles, UserRolesEnum } from "../utils/constants"

const ProjectMemberSchema=new Schema(
    {
         user:{
             type:Schema.Types.ObjectId,
             ref:"User"
         },
        ProjectName:{
            type:Schema.Types.ObjectId,
            ref:"Project"
        },
        Roles:{
            type:String,
            enum:availableUserRoles,
            default:UserRolesEnum.Project_Admin
        }
    }
)

const ProjectMember=mongoose.model("Task",ProjectMemberSchema)
export default ProjectMember