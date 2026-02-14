import { body } from "express-validator"

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
        body("newPassword").notEmpty("passowrd is required")
    ]
}

export {validate,loginValidate,passwordChange,userForgotPasswordValidator,userResetPasswordForgotValidator}