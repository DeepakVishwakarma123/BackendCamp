import mongoose from "mongoose"
import {Schema} from "mongoose"
import { assign } from "nodemailer/lib/shared"
import { TaskStatus, TaskStatusvalues } from "../utils/constants"

const TaskSchema=new Schema(
    {
        task:{
            type:String,
            require:true
        },
        Project:{
            type:Schema.Types.ObjectId,
            ref:"Project"
        },
        AssignBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        AssignTo:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        TaskStatus:{
            type:String,
            enum:TaskStatusvalues,
            default:TaskStatus.todo
        }
        
    }
)

const Task=mongoose.model("Task",TaskSchema)
export default Task