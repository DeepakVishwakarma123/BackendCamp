import mongoose from "mongoose"
import {Schema} from "mongoose"

const SubTaskSchema=new Schema(
    {
        subtask:{
            type:String,
            require:true
        },
        Task:{
            type:Schema.Types.ObjectId,
            ref:"Task"
        }
    }
)

const SubTask=mongoose.model("SubTask",SubTaskSchema)
export default SubTask