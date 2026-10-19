import asyncHandler from "../utils/async-handlers.js"
import Note from "../models/notes-model.js"
import apiResponse from "../utils/api-response.js"


let createNote=asyncHandler(
    async function (req,res) {
        let {projectId}=req.params 
        let {content}=req.body
        let CreatedPersonId=req.user._id
        let createdNote=await Note.create(
            {
                content,
                Project:projectId,
                createdBy:CreatedPersonId
            }
        )
        res.status(201).json(
            new apiResponse(
                201,"note created succcessfully",createdNote
            )
        )
    }
)



let updateNote=asyncHandler(
    async function (req,res) {
        let {projectId,noteId}=req.params 
        let {content}=req.body
        //searching document by using above fields data
        let updatedNoteDocument=await Note.findOneAndUpdate(
            {_id:noteId,Project:projectId},
            {content},
            {new:true}
        )

        res.status(200).json(
            new apiResponse(
                200,"note updated",updatedNoteDocument
            )
        )
    }
)


let deleteNote=asyncHandler(
    async function (req,res) {
        let {projectId,noteId}=req.params
        let deletedDocument=await Note.findOneAndDelete({_id:noteId,Project:projectId})
        res.status(200).json({
            "message":"deleted note successfully!!!!!!"
        })
    }
)

export {createNote,updateNote,deleteNote}