import ProjectMember from "../models/project-member.js";

//we are extracting project Details based on person Role
/*
we are extracting first ProjectMembar data based on userid and its role 
which gives us the project member data realted to spefic role and there we get that project id as well
then we lookup in project table extract data and send over http
*/
async function extractProjectDetails(PersonRole,UserId)
{
    //writing some aggreation pipeline 
    //to retrive project details based on PersonRole
    try{
  let ProjectDetails=await ProjectMember.aggregate(
        [
         {
            $match:{
                user:UserId,
                Role:PersonRole
                
            }
         },
         {
            $lookup:{
                from:"Projects",
                localField:"Project",
                foreignField:"_id",
                as:"project details"
            }
         }
        ]
    )

    return ProjectDetails
}
catch(error){
return `error happended ${error}`
}
}


export {extractProjectDetails}