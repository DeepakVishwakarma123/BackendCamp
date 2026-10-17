import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import Task from "../models/task-model.js";
import ProjectMember from "../models/project-member.js";
import SubTask from "../models/subtask-model.js";
import mongoose from "mongoose";



let createTask=asyncHandler(
    async function (req,res) {
        //values getting from request
        let {projectId}=req.params
        let {task,TaskStatus,AssignToUserId}=req.body

        //it will be id of project_admin,admin
        let AssigningUserId=req.user._id

        //creating a new document in task collection with above request values
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


let GetProjectTask=asyncHandler(
    async function (req,res) {
        let projectId=req.params
        let userId=req.user._id

        /*
        role find karo--admin,project amdin hai toh sidha project id ka use  karke saer task retrive kar liye
        agar member hai toh uska bhi id liya and AssingTo ke ander to jo task use assing hai woh nial liye bus 
        itna hi hai idhar
        */

        let ProjectMemberDocument=await ProjectMember.findById(
            {
                user:userId
            }
        )

        let loggedInuserRole=ProjectMemberDocument["Role"]
        let matchingConditionObject={
                        Project:projectId
                    }

         if(loggedInuserRole==="member")
         {
            matchingConditionObject={
                Project:projectId,
                AssignTo:userId
            }
         }

        let ProjectTasks=Task.aggregate(
            [
                {
                    $match:matchingConditionObject
                }
            ]
        )

        res.status(200).json(
            new apiResponse(200,"task fetched successfully",ProjectTasks)
        )
        //
    }
)

let GetTaskDetails=asyncHandler(
    async function (req,res) {
        let projectId=req.params
        let userId=req.user._id
        let taskId=req.params

        /*
        Get project taks role ke hissab se hi task send karta hai admin ko uske task spefic project main dikhenge
        and agar wo project admin yaa member hai toh us hissab se dikhne wala hai yaha pe task id se matlab hai 
        agar hume kuch restricatin rakhni hai ki task kya data dikhan hai toh project member pe query karo and role ka use
        karo uske liye upar wale code ka use kar sake ho
        neeche code main taskid jyda matter karti hai!!!
        */
        
        let ProjectTasks=Task.aggregate(
            [
                {
                    $match:{
                        "_id":taskId,
                        "Project":projectId
                    }
                }
            ]
        )

        res.status(200).json(
            new apiResponse(200,"task fetched successfully",ProjectTasks)
        )
        
    }
)





let changeAssignToPerson=asyncHandler(
    async function(req,res){
        let {projectId,taskId}=req.params
        let {AssignToPersonUserId}=req.body
        let updatingPersonId=req.user._id
        //agar jo person task assign kar raha hai woh alag hua us case ke liye yeh document main values update hogi
        let UpdateRuleObject={AssignBy:updatingPersonId,AssignTo:AssignToPersonUserId}
        // task id se task document pehle manga liya jisse kuch cheeze check kar sakte hai
        let TaskDocument=await Task.findById( {_id:taskId} )
        //don,t update id of AssignByPerson in case of again he is updating things
        if(TaskDocument.AssignBy===updatingPersonId)
        { 
           UpdateRuleObject={AssignTo:AssignToPersonUserId}
        }
        //sending updated values
        let TaskUpdatedDocument=Task.findByIdAndUpdate({_id:taskId},UpdateRuleObject,{new:true}).select("-Task -Project -TaskStatus")
        res.status(200).json(new apiResponse(
            200,"AssignedPerson Changed or Modified",TaskDocument
        )) 
       }
    )



//this controller update task and task status values only
let updateTaskContent=asynHandler(
    async function (req,res) {
        let {projectId}=req.params
        let {taskId}=req.params
        let {task,TaskStatus}=req.body
        //if request contains task,status then use this object to update both in task document
        let updateRuleObject={task:task,TaskStatus}
        if(TaskStatus===undefined)
         {
            //if status is not there update task only
            updateRuleObject={task:task}
         }else{
            //if task not,update taskstatus
            updateRuleObject={TaskStatus}
         }
        /*finding current userdetail*/
        let ContentChangingUserData=req.user
        let email=ContentChangingUserData.email 
        let userName=ContentChangingUserData.username 
        //this object is get sent via response alongside TaskUpdateDoc
        let userDetail={email,userName}

        let TaskUpdateDoc=Task.findByIdAndUpdate(
            {_id:taskId},
            updateRuleObject,
            {new:true}
        ).select("-Project -AssignBy -AssignTo -TaskStatus")

        res.status(200).json(
            new apiResponse(200,`task content updated by ${username}`,{
                TaskUpdateDoc,userDetail
            })
        )
    }
)

let deleteTask=asynHandler(
    async function (req,res) {
        let {projectId,taskId}=req.params
        let deleteDocument=Task.findOneAndDelete({_id:taskId,Project:projectId})
        res.status(200).json(new apiResponse(200,"deleted Succesfully task"))
    }
)

let createSubTask=asyncHandler(
    async function(req,res)
    {
        let {projectId,taskId}=req.params
        let {subtask}=req.body

        let createdSubtask=SubTask.create(
            {
                subtask,
                Task:new mongoose.Types.ObjectId(taskId) 
            }
        )

        res.status(201).json(
            new apiResponse(201,"subtask created successfully",createdSubtask)
        )
    }  
)








