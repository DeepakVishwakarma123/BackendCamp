class apiError extends Error
{
    constructor(statuscode,message="failed",errors=[],stack="")
    {
        super(message)
        this.statuscode=statuscode
        this.errors=errors
        this.success=false
        this.data=null
        if(stack)
        {
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default apiError
