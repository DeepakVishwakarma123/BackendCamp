import {Router} from "express"
import { adminProjectadminMiddleware } from "../middleware/admin-project_admin.middleware.js"
import authMiddlware from "../middleware/auth-middlware.js"
import {createNote,updateNote,deleteNote} from "../controllers/note-controller.js"


const NoteRouter=Router()


NoteRouter.route("/createNote/:projectId").post(authMiddlware,adminProjectadminMiddleware,createNote)
NoteRouter.route("/updateNote/:projectId/n/:noteId").put(authMiddlware,adminProjectadminMiddleware,updateNote)
NoteRouter.route("/deleteNote/:projectId/n/:noteId").delete(authMiddlware,adminProjectadminMiddleware,deleteNote)

export default NoteRouter