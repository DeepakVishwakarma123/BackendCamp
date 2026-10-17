import asyncHandler from "../utils/async-handlers.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";
import Task from "../models/task-model.js";
import ProjectMember from "../models/project-member.js";
/*
list project task,secured role based

get task details secured role based

create task(secured,admin,project admin)

update task(admin,project admin)


delete task,admin,project admin

create subtask (secured,admin/project_admin)

update subtask(secured role based)

delete subtask(secured,admin/project admin)

/*
----issue notice ------
----need improve and refactor------
task main agar task status and task assign kisko karna nhi 
pass ho raha hia to task tab bhi create karne do ye wala feature de sakte ho caheh to
kuch task aise ho sakte ho jo user kisi ko assign nhi karna chahta hai
toh use khali chodne ka option de skate ho yaa user ko khud assign kar sakte ho aap
ya phir stric task assign hi karna hoga toh yeh decide karke 
is functin ko tweak karo ise controller ko 
*/
let createTask=asyncHandler(
    async function (req,res) {
        let {projectId}=req.params
        //here task represt what work you have to do task status bata raha hai task ka status jaise inprogress completed todo etc
        let {task,TaskStatus,AssignToUserId}=req.body
        //yeh id admin,project admin ki hai hamare case main jo task assign kar raha hai 
        let AssigningUserId=req.user._id

         /*
         yaha pe hum log ek document create karnege task collection ke ander
         main assume karta huu ki jis person ko task assign karna hai uski id frontend se request main aayegi
        agar aisa nhi hai toh uska email se document ko search karke hum id fetch kar lenge dusra tarika yeh hai idhar
        */
        let createdTaskDocument=await Task.create(
            {
                task,
                Project:projectId,
                AssignBy:AssigningUserId,
                AssignTo:AssignToUserId,
                TaskStatus
            }
         )

         res.status(201).json(
            new apiResponse(201,"task created successfully",
                createdTaskDocument
            )
         )


    }
)

//---issue notice this controller just send project task and it's id not other details such as who assigned it assigned to what it's progress
//update code for above notice later on in future if not updated then writing two diffrent controller below is also doign same work in this case show we need to maker proper difference between both
//we get the task dependecy overall project id pe sab depen hai project id ke base pe us person ka role find out karo and then waise task dikha do simple 
let GetProjectTask=asyncHandler(
    async function (req,res) {
        let projectId=req.params
        let userId=req.user._id
        //sabse pehela sawal yaah pe hai ki user ka role kya hai kya woh admin hai ki member hai ki project_admin hai is project ke liye
        //simple request id ka use karke hume nikalenge uske role ki detail member table pe query karke
        //writing aggreagation pipeline to retrive all task belonging to spefic project

        let ProjectMemberDocument=await ProjectMember.findById(
            {
                user:userId
            }
        )

        let loggedInuserRole=ProjectMemberDocument["Role"]
        //use this below condition object to fetch all task belongin to spefic project in case of admin,
        //project_admin kyoki hume sare task unhe dikhane hai 
        //jab member role aayega toh hume ismain assingedTo user id ka use kar ke search kar lenge
        let matchingConditionObject={
                        Project:projectId
                    }

        //hum condition use karenge for cheking admin and project admin member role 
        /*
         abhi ke liye main kya kar raha huu agar role admin hai project admin hai toh seedha project id sare doc refer kar
         lo and agar role member hai to hum task collection main bascially kya karenge ki AssignedTo main user ki id ko use karek task ko match karnege 
         isse jo task usko assing hue rahenge woh usko dikhegne and kisne assing kiya hai woh dekhe sakta hai 
         but baki ke task ko nhi dekh sakta hai i think yeh decision shi hai admin aur project admin main kya kuch aur update kar sakte hai 
         woh hum baad main mange kar lenge
        */

         /*yeh code clean rahega pichli baar wale se
          and kafi chalaki se likhte hai ise
          do if else likhne ki jagah and do aggretion pipeline diffrent likhne ki jagah hum log kya karte hai 
          ek conditino dalenge and sare kaam usse hi kar lenge kafi smartly but aisa naa ho ki aggretion pipleine data vaise
          pass karna allowd nhi ho to use neglect manta huu sab shi rahega chalo code likhe dete hai 
          mere rule simple hai ki agar aapka role member hai toh jo search condtion wala match object hai use naye object 
          se replace kar denge ek tarah use nayi valu de di jo automatic aggration pipleine main chlaa jayga and agar
          condition match nhi hoti hai toh simple si baat hai agar person member nhi hai defintiyly woh admin yaa project admin hoga
          and us case main hume task sare dikhane hai kyonki overall dono ka kaam mange karna hai project_admin ke pass power kam hai 
          per task ki power use sari deni padegi
         */
         if(loggedInuserRole==="member")
         {
            matchingConditionObject={
                Project:projectId,
                AssignTo:userId
            }
         }

        let ProjectTasks=Task.aggregate(
            [
                {
                    $match:matchingConditionObject
                }
            ]
        )

        res.status(200).json(
            new apiResponse(200,"task fetched successfully",ProjectTasks)
        )
        //
    }
)

let GetTaskDetails=asyncHandler(
    async function (req,res) {
        let projectId=req.params
        let userId=req.user._id
        let taskId=req.params

        // let ProjectMemberDocument=await ProjectMember.findById(
        //     {
        //         user:userId
        //     }
        // )

        // let loggedInuserRole=ProjectMemberDocument["Role"]

        // let matchingConditionObject={
        //                 Project:projectId
        //             }
        //   if(loggedInuserRole==="member")
        //  {
        //     matchingConditionObject={
        //         Project:projectId,
        //         AssignTo:userId
        //     }
        //  }


        //yaha pe humne mana hai ki jo task detail aap fetch kar rahe ho
        //wo aapke role ke hissab se mili hui
        /*
            project task controller role ke hissab se data task ke send karta hai 
            and jisse kya hota hai ki
            admin ke pass admin level ke sare task dikhte hai 
            and same for member and project admin

            ab yaha pe hai kya ki bohot simple hai ki hume to pehle hi project ke task 
            filter karke abhi hum un task ki details dekhna chahhte hai simple tarike 
            se and woh hume mil jayega is query main ko i user id ki need nhi hia
            kyonki taskid independed hai woh unqiue hoti hia and simple member ke pass uske task ki
            list thi toh uski task id se usne use kar data dekh lega

            agar hume task detial kuch restriciton rakhni hai then upwar wale code
            ko chalukarke thoda sa tweak karke aggreatin pipeleine main aapkya karo
            addproject operator us karke cheeze kam yaa kuan si filed woh handle kar satke ho
        */


        let ProjectTasks=Task.aggregate(
            [
                {
                    $match:{
                        "_id":taskId,
                        "Project":projectId
                    }
                }
            ]
        )

        res.status(200).json(
            new apiResponse(200,"task fetched successfully",ProjectTasks)
        )
        
    }
)


/*
task update ,
changing task to some other project
might chances that assign by , assignto need to be change

---issue and bug notice
Taskstatus can also be changed and controll by two or three diffretn person
*/

let updateTask=asyncHandler(
    async function(req,res){
        let {projectId,taskId}=req.params
        let {AssignToPersonUserId,TaskStatus,Task}=req.body
        let updatingPersonId=req.user._id
        /*
        yeh jo update rule object hai 
        yeh diffrent value lega and same ek hi query main pass hoga 
        and jo bhi uske pass value hai usse base pe update kar dega just fine
        aisa code kuch pichle route main likha hua hai toh wahe se chek kar skate ho kuch
        hai nhi direct reference ka galat upyog 🤣 
        */


        /*
        is rule ka simle mearnign hai ki jo person hai woh basically koi dusra hai jo task ke person ko change kar raha hai 
        jasie projec admin ki jagah admin jisko task assign kiya hai usko change karta hai and viceversa
        */
        let UpdateRuleObject={AssignBy:updatingPersonId,AssignTo:AssignToPersonUserId}


          /*
        task ko update maan lo nhi kar raha hai user toh Task hume body main milga nhi yaa
        ho sakta hai empty value aaye
        toh aise case main Task hume nhi milega to uski valu undefined rahegi us hissab se hum ek code likhenge jo ki
        update object ke taru pe use hoga hamare findbyidandupdate ke set functon ke ander
        */
       /*
        agar task undefined hai and taskstatus bhi iska sirf ek matlab hai ki samne
        wala jo hai woh Assing To change karega ab yaha pe agar vo chnage kar raha hia 
        to hume change karewala perosn old wala hi hai ki koi aur aa gya hai 
        example yha pe hai ise tum future main code smjhne ke liye refer kar sakte ho
        jaise ki 
        task create kiya project admin rahul ne and usne assing kiya kriya
        ko and toh taskdocument kuch asia bana 

        taskid
        task ka content jo bhi hai
        task assign karne wale ki id jo ki yah pe rahul ki aayegi 
        task karne wale ki id jo ki kriya ki aayegi yaha pe 
        task status jo bhi yaha pe hoga

        ab case dekho 2 cases hai and vicevers ho sakte hai 
        ab rahul ko lagta hai ki kriya acha kaam nhi kar rahi hai toh usne us task
        ko assign karna chhat hai siddhi ko 

        toh hume upar rahul ki id to as it as rakhni hai per kirya ki jagah siddhi ki id rakhni hai
        ab dusra case kya hai yaha pe ki admin ne kuch change s kiya toh dono update hogi  
        assign karne wale main rahul ki jagah admin ki id aaygi and jisko bi usen updat main kiya hoga uski
       */
        
        if(Task===undefined || TaskStatus===undefined)
        {
            /*
             jab task undefind ho yaa taskstatus undefine ho toh yeh code chla chahiye but
             agar aisa hia toh kya karoge ki task status change kar raha hai and sath main assing wala 
             bhi kcuh aa rha hai yaa ulta ho sakt hai ki aapka task chan kar rah hai sath main taskstatus bhi and asisng bhi ya task and assingto sirf 
             ab yehi cases bache hai inke liye thoda hume code ache se likhan padega
             toh main idhar hi band karta huu isko plan kiye bina aage likh nhi sakte hia 
             abhi k liey thik hai per isem ye kuch edge case hai yaa isse aur simple kar ssatek hai hum log kuch tarike se ab chlao dekhte hai kaise kya karna hai 
            */
        }


        // task id se task document pehle manga liya jisse kuch cheeze check kar sakte hai
        let TaskDocument=await Task.findByIdAndUpdate( {_id:taskId} )

        /*
        agar id same hai toh project admin, yaa admin hi hoga jo dobare se 
        assingTo person ko chnage kar raha hai dusra case neeche dekho
        */
        if(TaskDocument.AssignBy===updatingPersonId)
        {
            /*s case main document ko update karna hai per sirf AssingToId ko aur kuch nhi hai
              hum idhar kuch nhi karengi neeche jo query hai usme ek object use hai jiski value by default kuch rahegi but 
              hum usk value ko yaha pe is condition main update karnege apne hissabs se and 
              agar condition match nhi hui toh diffrent wala case main upar default different wale code chal jayega koi dikkat nhi hai idhar
            */
           UpdateRuleObject={AssignTo:AssignToPersonUserId}
        }

        /*
        agar upar wale condtion match nhi hogi toh yeh wala code automatically updateRule object main aayega
        jiska meaing simple hai ki jo person  hai jo jisko task diya gya hai usko change kar raha hai woh pichli baar jisne task fist time bana tha woh nhi koi 
        aur hai shayd se admin ki jagah project_admin hia yaa iska ulta ho sakta hai 
        let UpdateRuleObject={AssignBy:updatingPersonId,AssignTo:AssignToPersonUserId}
        */
        let TaskUpdatedDocument=Task.findByIdAndUpdate({_id:taskId},UpdateRuleObject,{new:true})


    }
)




