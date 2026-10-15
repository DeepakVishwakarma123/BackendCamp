import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import Task from "../models/task-model.js";

/*
list project task,secured role based

get task details secured role based

create task(secured,admin,project admin)

update task(admin,project admin)


delete task,admin,project admin

create subtask (secured,admin/project_admin)

update subtask(secured role based)

delete subtask(secured,admin/project admin)

*/

let createTask=asyncHandler(
    async function (req,res) {
        let {projectId}=req.params
        //here task represt what work you have to do task status bata raha hai task ka status jaise inprogress completed todo etc
        let {task,TaskStatus,AssignToUserId}=req.body
        //yeh id admin,project admin ki hai hamare case main jo task assign kar raha hai 
        let AssigningUserId=req.user._id

         /*
         yaha pe hum log ek document create karnege task collection ke ander
         main assume karta huu ki jis person ko task assign karna hai uski id frontend se request main aayegi
        agar aisa nhi hai toh uska email se document ko search karke hum id fetch kar lenge dusra tarika yeh hai idhar
        */
        let createdTaskDocument=await Task.create(
            {
                task,
                Project:projectId,
                AssignBy:AssigningUserId,
                AssignTo:AssignToUserId,
                TaskStatus
            }
         )

         res.status(201).json(
            new apiResponse(201,"task created successfully",
                createdTaskDocument
            )
         )


    }
)




