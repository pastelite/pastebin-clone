import e, { Router} from "express";
import { writeFile, readFile } from "fs/promises"
import { existsSync } from "fs";
import { editCodeCheck, editFile, getFile, saveFile } from "../controller/fileController";
import {verbose,Database} from "sqlite3";
const db = new Database('./test.db')

const router = Router();

router.post('/',saveFile)
router.get('/sqlite',(req,res,next)=>{
  db.run("SELECT a FROM editcode")
})
router.get('/:id',getFile)
router.get('/:id/edit',editCodeCheck,(req,res,next)=>res.json({message:"correct!"}))
router.post('/:id/edit',editCodeCheck,editFile)

export default router;