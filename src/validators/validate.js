import { body, param } from "express-validator"

function validate()
{
console.log("hello things are here in validate function")
return [
    body('email').trim().notEmpty().isEmail().withMessage("email is not valid in format").escape(),
    body('username').trim().notEmpty().isLowercase().withMessage('name should be in lowercase').isLength(4).withMessage("the name wojld be more than 4 character are allowed").escape(),
    body('password').trim().notEmpty().isLength(6).withMessage("passoword would be 6 chracter are allowed only").escape()
]
}

function loginValidate()
{
    return [
        body('email').
        trim().
        notEmpty().
        withMessage("email is empty").
        isEmail()
        .withMessage("email is not valid"),
        body('password').trim().notEmpty().
        withMessage("password field can not be empty").escape()
    ]
}

function passwordChange()
{  
    return [
        body("oldPassword").trim().notEmpty().withMessage("password required").isLength(8).escape(),
        body("newPassword").trim().notEmpty().isLength(8).escape()
    ]
}

function userForgotPasswordValidator()
{
    return [
        body("email").trim().notEmpty().withMessage("email is required").isEmail().withMessage("email should not valid")
    ]
}


function userResetPasswordForgotValidator()
{
    return [
        body("newPassword").notEmpty()
    ]
}

//limiting maxium number of character to avoid huge value of misrequest data
function createProjectValidator(){
    return [
        body("projectName").trim().notEmpty().withMessage(
            "projectName is required"
        ).isLength(
            {
                max:140
            }
        ).withMessage(
            "Project Name max charater is allowed only 100 limit reached"
        ),
        body("Description").trim().notEmpty().withMessage("project Description is required").escape().isLength(
            {
                max:250
            }
        ).withMessage(
            "project description limit exceeded"
        )
    ]
}

function UpdateProjectValidator()
{
    return[
        body("Description").trim().notEmpty().withMessage("project description is required").isLength(
            {max:250}
        ).withMessage(
            "max character is allowed 250 only for project description"
        )
    ]
}

/*
delete project validator kya karega check karega
 exact id  length count kitna hai
 mongodb ke jo object id ki max length 24 character hoti hai 
*/
function deleteProjectValidator()
{
return [
    body("projectId").trim().isLength({min:24,max:24}).withMessage(
        "invalid project id passed valid project id here"
    )
    .isString().withMessage(
        "project id format is incorrect"
    )
]
}

function InviteviaEmailValidator()
{
    return [
        body("inviteEmailId").trim().isEmail().withMessage("provide valid email id--->invalid email id"),
        //the invitePersonRole can be gone become three values such as admin,project_admin,member one of three show we use isIN to provide list to compare role which come in request against allowed role list
        body("invitePersonRole").trim().isString().isIn(
            [
                "admin",
                "project_admin",
                "member"
            ]
        ).withMessage(
            "invalid role found in request pass valid role"
        ),
        param("ProjectId").trim().isLength(
          {
            min:24,
            max:24
          }
        ).withMessage("invalid Project Id")
    ]
}

function ProjectIdParamsValidator()
{
    return [
        params("projectId").trim().isLength(
            {
                min:24,
                max:24
            }
        ).withMessage(
            "invalid project id can not allowed"
        )
    ]
}

function InviteLinkIdParamsValidator()
{
    return [
        params("inviteLinkId").trim().isLength(
            {
                min:24,
                max:24
            }
        ).withMessage(
            "invalid inviteLink forbidden request"
        )
    ]
}

function GetProjectDetailsValidator()
{
    return [
        params("PersonRole").trim().isIn(
            [
                "admin",
                "project_admin",
                "member"
            ]
        ).withMessage(
            "invalid role not supported please provide value role to get project details"
        )
    ]
}

function updateMemberRoleValidator()
{
    return [
        // agar multiple same type ke data pe check karna hai toh ek hi ke ander likhe sakte ho jasie neeche array ke form main dono field ko ek hi chian se validate karna hai toh dono id hi overall
        params(["projectId","userId"]).trim().isLength(
            {
                min:24,
                max:24
            }
        ).withMessage(
            "invalid id found not allowed provide value project id"
        ).escape(),
        body("PersonRole").trim().isIn(
            [
                "admin",
                "project_admin",
                "member"
            ]
        ).withMessage(
            "not supported this role please pass valid role in request"
        )

    ]
}








export {validate,loginValidate,passwordChange,userForgotPasswordValidator,userResetPasswordForgotValidator}