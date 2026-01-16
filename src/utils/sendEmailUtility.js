import Mailgen from "mailgen"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config(
    {
        path:"./.env"
    }
)

let sendEmail=async (options) => {
    //defining mailgen object for setting up some configurations
    let mailGenObject=new Mailgen(
        {
            theme:"cerberus",
            product:{
                name:"baseCampy",
                link:"https://peerlist.io/consistency",
                copyright:`Copyright &#169 All Rights Reserverd ${new Date().getFullYear()}`
            }
        }
    )

    //mail content is body which is returned by emailcontent generation template function
    // it get used wherever show we passed that value with the help of an object
    let mailGenTextContent=mailGenObject.generatePlaintext(options.mailContent)
    let mailGenHtml=mailGenObject.generate(options.mailContent)

    //defining configurations for smtp service
    //here we use ethereal email for fake simulation not actual ones
  let mailTransPortObject=nodemailer.createTransport(
        {
            host:"sandbox.smtp.mailtrap.io",
            port:"25",
            auth:{
                user:"dba4c2ce0add4c",
                pass:"25f523db609b38"
            }
        }
    )

    
    //sending email with nodemailer
    try {
    let info=await mailTransPortObject.sendMail(
                         {
                            from:"basecampy@gmail.com",
                            to:options.receiverEmailAddress,
                            subject:"hello",
                            text:mailGenTextContent,
                            html:mailGenHtml
                         }
        )
        console.log("mail sended succesfully");
        
    } catch (error) {
       return Promise.reject("error happend durign mail send utility")
        
    }
}

export default sendEmail