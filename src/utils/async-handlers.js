const asyncHandler=(requestHandler) => 
{
// the below request we are returnign as a callback function for our controller
return (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next))
    .catch(
        (error) => {
            next(error)
        }
    )
}
}

export default asyncHandler



