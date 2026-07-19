//constants holds this file 
//in every web application thee are some fields whihc are acts as a fixed value you can say
//that can not changed through out the project and literally they are useable every time

export const UserRolesEnum={
    ADMIN:"admin",
    Project_Admin:"project_admin",
    MEMBER:"member"
}

export const availableUserRoles=Object.values(UserRolesEnum)

export const TaskStatus={
    todo:"todo",
    inprogress:"inprogress",
    done:"done"
}

export const TaskStatusvalues=Object.values(TaskStatus)