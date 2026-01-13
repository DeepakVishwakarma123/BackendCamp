/*
below email is an template used in any case to generate any email content
by providin emailBodyObject
*/

//using other parameter as url to make things distinguishable

//the emaillinkURl is url which is used to getting user to forwared on another route
//example:- forgot route,verification route
let emailContentBodyGenWithUrl=(emailBodyObject,emailLinkUrl)  => {
    let emailBodyContent={
        body:
        {
            name:emailBodyObject.username || "User",
            intor:emailBodyObject.intro || "Welcome user you request for following thing to be handle",
            action:{
                instructions:emailBodyObject.instructions || "to get started doing process click on below link",
                button:{
                    color:"#66429fff",
                    text:emailBodyObject.linkText || "click to do process",
                    link:emailLinkUrl
                }
            }
        },
        outro:emailBodyObject.outro || "this is sytem generated email"
    }
    return emailBodyContent
}

//the below function is used for generating email content and it return that object with holding values
export default emailContentBodyGenWithUrl