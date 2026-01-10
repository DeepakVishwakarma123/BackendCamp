import apiResponse from "../utils/api-response.js"
import asyncHandler from "../utils/async-handlers.js";


// controllers are alwasy async functions
// function healthcheckController(req,res)
// {   
//     try {
//         res.status(200).json(
//             new apiResponse(200,"system is running well",{healthStatus:100})
//         )
        
//     } catch (error)
//     {
//         console.log(error);
        
//     }
// }

const healthcheckController=asyncHandler(
    async (req,res,next) => {
         res.status(200).json(
            new apiResponse(200,"system runnign well",{
                health:"100%"
            })
         )
    }
)

export default healthcheckController