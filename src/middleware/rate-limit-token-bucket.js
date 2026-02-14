// import apiResponse from "../utils/api-response.js";
import apiError from "../utils/api-error.js";

let maxTokenLimit=5    
// setInterval(
//     () =>  {
//             if(maxTokenLimit<5)
//             {
//                 maxTokenLimit+=1
//                 console.log("max token value is now",maxTokenLimit)
//                 return
//             }
//             else{
//                 console.log("max now")
//             }
//         }
//         ,11000     
// )
let i=1
let rateLimit=async function(req,res,next) {
    setInterval(
    () =>  {
            if(maxTokenLimit<5)
            {
                maxTokenLimit+=1
                console.log("max token value is now",maxTokenLimit)
                console.log(i)
                return
            }
            else{
                console.log("max now")
            }
        }
        ,11000     
)
    if(maxTokenLimit!=0)
    {
        maxTokenLimit-=1
        console.log("its value after consumption",maxTokenLimit)
        return next()
    }
    else{
        throw new apiError(404,"bad request try after some time later")
    }
}

export default rateLimit
