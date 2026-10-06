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
            createdProject
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


//Add project member
let addProjectMember=asyncHandler(
    async function (req,res) {
        
    }
)

let ListProjectMember=asyncHandler(
    async function (req,res)
    {
        let {projectId}=req.params
        /*
        we are gone writing an aggreation pipeline here to fetch all project member belonging to specfic project
        */
        let ProjectMemberDetails=ProjectMember.aggregate(
            [
                {
                    $match:{
                        "Project":projectId
                    }
                },

                {
               $lookup:{
               from: "users",
               localField:"user",
               foreignField:"_id",
               as: "userData"
                }
               },

              {
              $project: {
            _id:0,
             userData:1
            }
             }    
            
            ]

        )

        /*currently we are sending all user data like his other information as well
          such as jwt token details his other things such as email,avatar url which we don,t need
          at now because it alos increases payload size as well as it is not good 
          approach when come to security flow!!! we do or update this thing in next day
          but before do those activity we need to add another controller here such as
          for adding usre as project member with definite role
        */

        res.status(200).json(
            new apiResponse(200,"project member details are here",
                ProjectMemberDetails
            )
        )
  }
)

export {createProject,updateProject,deleteProject}
