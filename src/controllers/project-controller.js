import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import Project from "../models/projects-model.js";
import mongoose from "mongoose"
import ProjectMember from "../models/project-member.js";
import { UserRolesEnum } from "../utils/constants.js";


// i can use try catch again and again that is okay for me

let createProject=asyncHandler(
    async function (req,res,next) {
        let {projectName,Description}=req.body
        // i can extract the user id as here user is login show i
        // have user id in the object itself 
    let createdProject=await Project.create(
            {
                projectName,
                CreatedBy:new mongoose.Types.ObjectId(req.user._id),
                Description
            }        
        )

    await ProjectMember.create(
        {
            user:new mongoose.Types.ObjectId(req.user._id),
            Project:new mongoose.Types.ObjectId(createProject._id),
            Role:UserRolesEnum.ADMIN
        }
    )
    res.status(201).json(
        new apiResponse(
            201,"Project Created",
            createProject
        )
    )
    }
)


let updateProject=asyncHandler(
    async function (req,res,next) {
        let {Description}=req.body
        let {projectId}=req.params
        //we have project member document which has project id  we use it to find the doc and upate it
      let UpdatedProject=await Project.findByIdAndUpdate(
            projectId,
            {
                $set:{
                 Description:Description
                }
            },
            {
                new:true
            }
        )

        if(UpdatedProject)
        {
           return  res.status(201).json(
                new apiResponse(
                    201,"Project Update",UpdatedProject
                )
            )
        }

        return res.status(404).json(
            404,"Project Not found"
        )

    }
     ) 

//delete the project
let deleteProject=asyncHandler(
    async function (req,res) {

      let {projectId}=req.body
      let deleteProject=await Project.findByIdAndDelete(projectId)
      if(deleteProject)
      {
        return res.status(201).json(new apiResponse(
            201,"deleted Succesfully"
        ))
      }
      return res.status(404).json(
        new apiResponse(404,"Project Not Found")
      )
     }
)


export {createProject,updateProject,deleteProject}
