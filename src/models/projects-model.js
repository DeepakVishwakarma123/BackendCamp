import mongoose from "mongoose"
import {Schema} from "mongoose"


// projects models scehma

const projectSchema=new Schema(
    {
        projectName:{
            type:String,
            require:true,
            trim:true
        },
        CreatedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        Description:{
            type:String,
            require:true
        }
    },{
        timestamps:true
    }
)

const Project=mongoose.model("Project",projectSchema)
export default Project