import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import Project from "../models/projects-model.js";
import mongoose from "mongoose"
import ProjectMember from "../models/project-member.js";
import { UserRolesEnum } from "../utils/constants.js";
import InviteLink from "../models/invitelink-model.js";
import User from "../models/user-model.js";
import { inviteLinkContentMail } from "../utils/emailContentGenertionFunction.js";
import sendEmail from "../utils/sendEmailUtility.js"

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


//invite link Generator Controller
let InviteLinkGenerateAndMail=asyncHandler(
    async function(req,res)
    {

        //we get an email from request body
        let {inviteEmailId,invitePersonRole}=req.body
        let {ProjectId}=req.params

        /*
        issue no-1
        fixing duplicate entry issues of again invitelink
          creation the below code and condition fix this things
          show the same email can not have two diffrent invite link
          so hum check karnege ki jo email pe aap invite bhejna chahhte ho wah same project id
          pe use hai ki nhi mera kehne ka matlab hai ki agar invite already send kiya hai
          current project ke sath to dusra nhi bhej sakte hai diffrent project ke liye allowed hoga
        */
        //issue resolving code start from here
        let isInviteLinkExist=await InviteLink.findOne({
            invitedPersonEmail:inviteEmailId,
            ProjectId
        })

        if(isInviteLinkExist)
        {
            res.status(409).json(
                new apiResponse(409,"email already sent check spam and other folder to search for it")
            )
            return
        }
        //issue no-1 resolving code end here
        /*
        agar email aur link generate tab hoga agar project id diffrent hogi otherwise nhi
        */

        console.log("project id value now",ProjectId);
        
        //we should had to enter this thing in our database 
        let InviteDocument=await InviteLink.create({
            invitedPersonEmail:inviteEmailId,
            invitePersonRole,
            ProjectId
        })

        //searching for Project Details
        let ProjectData=await Project.findById({_id:new mongoose.Types.ObjectId(ProjectId)})
        console.log("Project Data is here",ProjectData);
        console.log("Invite Document is Ready",InviteDocument);

        //admin Basic Details
        let userData=await User.findById({_id:ProjectData.CreatedBy}).select("-email -password -isEmailVerfied -refreshToken -forgotPasswordToken -emailVerficationToken")
        
        //there are might chances that InviteDocument can be empty or null
        //we need to generate an link or you can say an mail template
        //generating content for sending mail
        let mailContent=inviteLinkContentMail(ProjectData,userData,InviteDocument)
        let options={
            mailContent,
            receiverEmailAddress:inviteEmailId
        }
        let result=await sendEmail(options)
        //yeh decision galat ho sakta hia kyonki main ek tarah se link ko kafi openly send kiy hai 
        if(typeof(result)==="string")
        {
            res.status(503).json(new apiResponse(503,`email sending service is unavialable share this invite link to member you want to add, via email or other source here is link http://localhost:4001/api/v1/project/Verifyinvitedmember/${InviteDocument._id}`))
            return
        }

        res.status(200).json(new apiResponse(200,"invite link send successfully"))
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

let addInvitedMemberToProject=asyncHandler(
    async function (req,res) {
        //extracting inviteLinkId value from request params
        let {inviteLinkId}=req.params 
        let invitedPersonDocument=await InviteLink.findById({_id:inviteLinkId})
        let loginedUserEmailId=req.user.email 
        let invitedPersonEmailId=invitedPersonDocument.invitedPersonEmail
        let projectId=invitedPersonDocument.ProjectId
        let invitedPersonRole=invitedPersonDocument.invitePersonRole
        if(invitedPersonEmailId!=loginedUserEmailId)
        {
            res.status(401).json(
                new apiResponse(401,"Unauthorized User,Use Valid Email Id")
            )
            return 
        }
        //if everything is okay such as emailid===inviteduseremailid
        //create project member document with assciate role 
        let AddedProjectMemberDocument=await ProjectMember.create({
            user:new mongoose.Types.ObjectId(req.user._id),
            Project:new mongoose.Types.ObjectId(projectId),
            Role:invitedPersonRole
        })

        res.status(200).json(
                new apiResponse(201,"Added member into Project",createProject)
        )

    }
)
export {createProject,updateProject,deleteProject,InviteLinkGenerateAndMail,addInvitedMemberToProject}
