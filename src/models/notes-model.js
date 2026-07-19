import mongoose from "mongoose"
import {Schema} from "mongoose"
import { assign } from "nodemailer/lib/shared"

const NoteSchema=new Schema(
    {
        content:{
            type:String,
            require:true
        },
        Project:{
            type:Schema.Types.ObjectId,
            ref:"Project"
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
)

const Note=mongoose.model("Note",NoteSchema)
export default Note