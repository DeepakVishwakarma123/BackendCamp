import mongoose from "mongoose"
import {Schema} from "mongoose"
import { availableUserRoles, UserRolesEnum } from "../utils/constants.js"

const ProjectMemberSchema=new Schema(
    {
         user:{
             type:Schema.Types.ObjectId,
             ref:"User"
         },
        Project:{
            type:Schema.Types.ObjectId,
            ref:"Project"
        },
        Role:{
            type:String,
            enum:availableUserRoles,
            default:UserRolesEnum.Project_Admin
        }
    }
)

const ProjectMember=mongoose.model("Task",ProjectMemberSchema)
export default ProjectMember