import e, { Router} from "express";
import { writeFile, readFile } from "fs/promises"
import { existsSync } from "fs";
import { getFile, saveFile } from "../controller/fileController";
import {verbose,Database} from "sqlite3";
const db = new Database('./test.db')

const router = Router();

router.post('/',saveFile)
router.get('/sqlite',(req,res,next)=>{
  db.run("SELECT a FROM editcode")
})
router.get('/:id',getFile)

export default router;